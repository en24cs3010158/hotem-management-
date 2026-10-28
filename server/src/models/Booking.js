import mongoose from 'mongoose';
const bookingSchema = new mongoose.Schema({
  guest: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  checkIn: { type: Date, required: true }, checkOut: { type: Date, required: true },
  guests: { type: Number, required: true, min: 1 }, nights: { type: Number, required: true }, total: { type: Number, required: true },
  status: { type: String, enum: ['pending','confirmed','checked-in','checked-out','cancelled'], default: 'confirmed' },
  specialRequests: { type: String, default: '' }, cancellationReason: { type: String, default: '' }
}, { timestamps: true });
bookingSchema.index({ room: 1, checkIn: 1, checkOut: 1, status: 1 });
export default mongoose.model('Booking', bookingSchema);
