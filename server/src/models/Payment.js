import mongoose from 'mongoose';
const schema = new mongoose.Schema({ booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true }, guest: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, amount: { type: Number, required: true }, currency: { type: String, default: 'INR' }, status: { type: String, enum: ['demo-paid','pending','failed','refunded'], default: 'pending' }, provider: { type: String, default: 'demo' }, reference: { type: String, default: '' } }, { timestamps: true });
export default mongoose.model('Payment', schema);
