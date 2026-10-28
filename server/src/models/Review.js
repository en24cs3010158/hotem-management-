import mongoose from 'mongoose';
const schema = new mongoose.Schema({ guest: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true, unique: true }, rating: { type: Number, min: 1, max: 5, required: true }, comment: { type: String, default: '', maxlength: 1000 } }, { timestamps: true });
export default mongoose.model('Review', schema);
