import express from 'express';
import Booking from '../models/Booking.js';
import { authMiddleware, authorize } from '../middleware/auth.js';

const router = express.Router();

// Create booking (user)
router.post('/', authMiddleware, authorize('user'), async (req, res) => {
  try {
    const { workerId, service, bookingDate, serviceDate } = req.body;
    const booking = new Booking({
      user: req.user._id,
      worker: workerId || null,
      service,
      bookingDate,
      serviceDate
    });
    await booking.save();
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get bookings (filtered by role)
router.get('/', authMiddleware, async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'user') query.user = req.user._id;
    if (req.user.role === 'worker') query.worker = req.user._id;

    const bookings = await Booking.find(query)
      .populate('user', 'name email')
      .populate('worker', 'name email')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Accept booking (worker/admin)
router.post('/:id/accept', authMiddleware, authorize(['worker', 'admin']), async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Not found' });

    booking.status = 'accepted';
    if (req.user.role === 'worker') booking.worker = req.user._id;

    await booking.save();
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Mark as completed (worker/admin)
router.post('/:id/complete', authMiddleware, authorize(['worker', 'admin']), async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Not found' });

    booking.status = 'completed';
    await booking.save();
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
