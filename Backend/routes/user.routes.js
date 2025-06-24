const express=require('express');
const { registerUser, loginUser, getUserProfile, updateProfile } = require('../Controller/user.controller');
const userRouter=express.Router();

const authUser=require('../Middlewares/auth.user');
const multer=require('../configuration/multer.config');

userRouter.post('/register',registerUser);

userRouter.post('/login',loginUser);

userRouter.get('/profile',authUser,getUserProfile);

userRouter.put('/update/profile',authUser,multer.single('user-profile'),updateProfile);

module.exports=userRouter;