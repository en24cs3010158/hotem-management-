import { Router } from 'express';
import Booking from '../models/Booking.js'; import Room from '../models/Room.js'; import {protect,allow} from '../middleware/auth.js';
const router=Router();
router.post('/',protect,allow('guest','admin'),async(req,res,next)=>{try{
 const {roomId,checkIn,checkOut,guests=1,specialRequests=''}=req.body; const start=new Date(checkIn),end=new Date(checkOut);
 if(!roomId||Number.isNaN(+start)||Number.isNaN(+end)||end<=start||start<new Date(new Date().setHours(0,0,0,0)))return res.status(400).json({message:'Choose valid future check-in and check-out dates'});
 const room=await Room.findById(roomId);if(!room||room.status!=='available')return res.status(404).json({message:'Room is not available'});
 if(Number(guests)<1||Number(guests)>room.capacity)return res.status(400).json({message:`This room accommodates up to ${room.capacity} guests`});
 const conflict=await Booking.findOne({room:room._id,status:{$in:['pending','confirmed','checked-in']},checkIn:{$lt:end},checkOut:{$gt:start}});if(conflict)return res.status(409).json({message:'This room is already booked for those dates'});
 const nights=Math.ceil((end-start)/86400000);const booking=await Booking.create({guest:req.user._id,room:room._id,checkIn:start,checkOut:end,guests:Number(guests),nights,total:nights*room.pricePerNight,specialRequests});
 await booking.populate('room');res.status(201).json({booking});
}catch(e){next(e)}});
router.get('/my',protect,async(req,res,next)=>{try{const bookings=await Booking.find({guest:req.user._id}).populate('room').sort({createdAt:-1});res.json({bookings})}catch(e){next(e)}});
router.get('/',protect,allow('staff','admin'),async(req,res,next)=>{try{const bookings=await Booking.find().populate('room').populate('guest','name email phone').sort({createdAt:-1}).limit(500);res.json({bookings})}catch(e){next(e)}});
router.patch('/:id/status',protect,allow('staff','admin'),async(req,res,next)=>{try{const allowed=['confirmed','checked-in','checked-out','cancelled'];if(!allowed.includes(req.body.status))return res.status(400).json({message:'Invalid status'});const booking=await Booking.findByIdAndUpdate(req.params.id,{status:req.body.status},{new:true}).populate('room').populate('guest','name email');if(!booking)return res.status(404).json({message:'Booking not found'});res.json({booking})}catch(e){next(e)}});
router.post('/:id/cancel',protect,async(req,res,next)=>{try{const booking=await Booking.findById(req.params.id);if(!booking)return res.status(404).json({message:'Booking not found'});if(String(booking.guest)!==String(req.user._id)&&!['admin','staff'].includes(req.user.role))return res.status(403).json({message:'Not your booking'});if(['checked-in','checked-out'].includes(booking.status))return res.status(400).json({message:'This reservation can no longer be cancelled'});booking.status='cancelled';booking.cancellationReason=String(req.body.reason||'').slice(0,500);await booking.save();await booking.populate('room');res.json({booking,message:'Booking cancelled. Any refund must be handled by the payment provider.'})}catch(e){next(e)}});
export default router;
