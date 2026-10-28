import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
const router = Router();
const tokenFor = id => jwt.sign({ id }, process.env.JWT_SECRET || 'development-only-secret', { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
router.post('/register', async (req,res,next) => { try {
  const { name, email, password, phone } = req.body;
  if (!name?.trim() || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({message:'Enter a valid name and email'});
  if (!password || password.length < 8) return res.status(400).json({message:'Password must be at least 8 characters'});
  if (await User.findOne({email:email.toLowerCase()})) return res.status(409).json({message:'Email is already registered'});
  const user = await User.create({ name: name.trim(), email, password: await bcrypt.hash(password,12), phone });
  res.status(201).json({ token:tokenFor(user._id), user:{id:user._id,name:user.name,email:user.email,role:user.role,phone:user.phone} });
} catch(e){next(e)} });
router.post('/login', async (req,res,next) => { try {
  const {email,password}=req.body; const user=await User.findOne({email:String(email||'').toLowerCase()}).select('+password');
  if (!user || !user.active || !(await bcrypt.compare(password||'',user.password))) return res.status(401).json({message:'Invalid email or password'});
  res.json({token:tokenFor(user._id),user:{id:user._id,name:user.name,email:user.email,role:user.role,phone:user.phone}});
} catch(e){next(e)} });
router.get('/me',protect,(req,res)=>res.json({user:req.user}));
router.patch('/profile',protect,async(req,res,next)=>{try{const allowed={name:req.body.name,phone:req.body.phone}; Object.keys(allowed).forEach(k=>allowed[k]===undefined&&delete allowed[k]); const user=await User.findByIdAndUpdate(req.user._id,allowed,{new:true,runValidators:true}).select('-password');res.json({user})}catch(e){next(e)}});
export default router;
