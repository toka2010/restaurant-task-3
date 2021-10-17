const express=require('express');
const userRoute=express.Router();
const userController=require('./../Controllers/userController');
userRoute.post('/signup',userController.signup);
userRoute.post('/login',userController.logIn);


module.exports=userRoute;