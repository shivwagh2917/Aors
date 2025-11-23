import express from 'express';
import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';
import { fileURLToPath } from 'url';

import Booking from '../models/Booking.js';
import Bill from '../models/Bill.js';
import { authMiddleware, authorize } from '../middleware/auth.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Generate bill (worker or admin)
router.post('/generate', authMiddleware, authorize(['worker', 'admin']), async (req, res) => {
  try {
    const { bookingId, additionalCosts } = req.body;

    const booking = await Booking.findById(bookingId).populate('user worker', 'name email phone address');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    const billsDir = path.join(__dirname, '..', 'data', 'bills');
    if (!fs.existsSync(billsDir)) fs.mkdirSync(billsDir, { recursive: true });

    const filename = `bill_${bookingId}_${Date.now()}.pdf`;
    const filepath = path.join(billsDir, filename);

    const doc = new PDFDocument();
    const stream = fs.createWriteStream(filepath);
    doc.pipe(stream);

    doc.fontSize(18).text('Repair Shop - Bill', { align: 'center' }).moveDown();
    doc.fontSize(12).text(`Booking ID: ${booking._id}`);
    doc.text(`User: ${booking.user?.name || ''} (${booking.user?.email || ''})`);
    doc.text(`Worker: ${booking.worker?.name || ''} (${booking.worker?.email || ''})`);
    doc.text(`Service: ${booking.service}`);
    doc.text(`Booking Date: ${booking.bookingDate}`);
    doc.text(`Service Date: ${booking.serviceDate}`).moveDown();

    doc.text('Additional Costs:');
    let total = 0;
    if (Array.isArray(additionalCosts)) {
      additionalCosts.forEach(item => {
        doc.text(`${item.description} - ₹${item.cost}`);
        total += Number(item.cost || 0);
      });
    }
    doc.moveDown();
    doc.text(`Total Additional: ₹${total}`);
    doc.end();

    stream.on('finish', async () => {
      booking.status = 'completed';
      booking.additionalCosts = Array.isArray(additionalCosts)
        ? additionalCosts
        : booking.additionalCosts;
      booking.billPath = filepath;
      await booking.save();

      const bill = new Bill({ booking: booking._id, path: filepath });
      await bill.save();

      res.json({ billPath: filepath, billId: bill._id });
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
