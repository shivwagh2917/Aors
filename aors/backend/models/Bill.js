import mongoose from 'mongoose';

const BillSchema = new mongoose.Schema({
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  path: String,
  createdAt: { type: Date, default: Date.now }
});

const Bill = mongoose.model('Bill', BillSchema);
export default Bill;
