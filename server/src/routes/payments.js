import {Router} from 'express';import Payment from '../models/Payment.js';import Booking from '../models/Booking.js';import {protect} from '../middleware/auth.js';
const router=Router();
// Safe demonstration only: no card details are accepted or processed here.
router.post('/demo-checkout',protect,async(req,res,next)=>{try{const booking=await Booking.findById(req.body.bookingId);if(!booking)return res.status(404).json({message:'Booking not found'});if(String(booking.guest)!==String(req.user._id)&&req.user.role!=='admin')return res.status(403).json({message:'Not your booking'});const payment=await Payment.create({booking:booking._id,guest:req.user._id,amount:booking.total,status:'demo-paid',provider:'demo',reference:`DEMO-${Date.now()}`});res.status(201).json({payment,message:'Demo payment recorded. This is not a real charge.'})}catch(e){next(e)}});
router.get('/my',protect,async(req,res,next)=>{try{const payments=await Payment.find({guest:req.user._id}).populate('booking').sort({createdAt:-1});res.json({payments})}catch(e){next(e)}});
export default router;
