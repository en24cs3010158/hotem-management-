import mongoose from 'mongoose';
const roomSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true, enum: ['Standard','Deluxe','Suite','Family','Executive'] },
  description: { type: String, default: '' },
  pricePerNight: { type: Number, required: true, min: 1 },
  capacity: { type: Number, default: 2, min: 1 },
  imageUrl: { type: String, default: '' },
  amenities: [{ type: String }],
  status: { type: String, enum: ['available','maintenance','inactive'], default: 'available' },
  roomNumber: { type: String, required: true, unique: true },
  hotelName: { type: String, default: 'Roomly Hotel' }
}, { timestamps: true });
roomSchema.index({ category: 1, status: 1, pricePerNight: 1 });
export default mongoose.model('Room', roomSchema);
