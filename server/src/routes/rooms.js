import { Router } from 'express';
import Room from '../models/Room.js';
import Booking from '../models/Booking.js';
import { protect, allow } from '../middleware/auth.js';
const router=Router();
router.get('/',async(req,res,next)=>{try{
 const q={status:'available'}; if(req.query.category)q.category=req.query.category;
 if(req.query.maxPrice)q.pricePerNight={$lte:Number(req.query.maxPrice)};
 if(req.query.capacity)q.capacity={$gte:Number(req.query.capacity)};
 const page=Math.max(1,Number(req.query.page)||1), limit=Math.min(24,Math.max(1,Number(req.query.limit)||12));
 const [rooms,total]=await Promise.all([Room.find(q).sort({pricePerNight:1}).skip((page-1)*limit).limit(limit),Room.countDocuments(q)]);
 let available=rooms;
 if(req.query.checkIn&&req.query.checkOut){const start=new Date(req.query.checkIn),end=new Date(req.query.checkOut);if(!Number.isNaN(+start)&&!Number.isNaN(+end)&&end>start){const busy=await Booking.find({room:{$in:rooms.map(r=>r._id)},status:{$in:['pending','confirmed','checked-in']},checkIn:{$lt:end},checkOut:{$gt:start}}).distinct('room');available=rooms.filter(r=>!busy.some(id=>String(id)===String(r._id)));}}
 res.json({rooms:available,total:available.length,page,pages:Math.ceil(total/limit)});
}catch(e){next(e)}});
router.get('/:id',async(req,res,next)=>{try{const room=await Room.findById(req.params.id);if(!room)return res.status(404).json({message:'Room not found'});res.json({room})}catch(e){next(e)}});
router.post('/',protect,allow('staff','admin'),async(req,res,next)=>{try{const room=await Room.create(req.body);res.status(201).json({room})}catch(e){next(e)}});
router.patch('/:id',protect,allow('staff','admin'),async(req,res,next)=>{try{const room=await Room.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});if(!room)return res.status(404).json({message:'Room not found'});res.json({room})}catch(e){next(e)}});
router.delete('/:id',protect,allow('admin'),async(req,res,next)=>{try{const room=await Room.findByIdAndDelete(req.params.id);if(!room)return res.status(404).json({message:'Room not found'});res.json({message:'Room deleted'})}catch(e){next(e)}});
export default router;
