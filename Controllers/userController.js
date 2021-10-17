const user=require('./../Models/userModel');
const jwt = require('jsonwebtoken');
const AppError=require('./../utils/appError');
const { promisify } = require('util');
const catchAsync=require('./../utils/catchAsync');


/// create Token
const signrtoken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES_IN
        })
}
//_____________________________________________
exports.signup= async (req,res)=>{
   try{
 
    const newuser= await user.create(
        {
            name: req.body.name,
    email: req.body.email,
    password: req.body.password
    }
    );
    const token=signrtoken(newuser._id);
    
    res.status(200).json({
        stataus:'succes',
        token,
        data:{
            newuser
        }
    
    })
}catch(err){
    res.status(400).json({
      status:"Fail",
      message:err.message
    })

  }

    }

//Login ///////_____________________________
exports.logIn= async(req,res, next)=>{
    try{
    const{email,password}=req.body;
    if(!email || !password){
       res.status(401).json({
           status:"fail",
           message:"Please provide  email and Password"
       })
    }
    const userlog=await user.findOne({email}).select('+password');
console.log(userlog);

    if(  !userlog || !( await userlog.correctPassword(password,userlog.password))){
      return next(  res.status(401).json({
        status:"fail",
        message:"incorrect email Password"
    }))
       
    }
        const token= signrtoken(userlog._id);
    res.status(200).json({
        status:'succes',
        token
    })
}catch(err){
    res.status(400).json({
      status:"Fail",
      message:err.message
    })

  }
}

/////Check If User Login
const chkLogin=async(req,res,next)=>{
    try{
        
      // req.headers.Authorization = "Bearer " + localStorage.getItem("token");
       //console.log("🚀 ~ file: userController.js ~ line 84 ~ chkLogin ~  req.headers.Authorization",  req.headers.Authorization)
        let token;
    if (
      req.headers.authorization 
    ) {

      token = req.headers.authorization;
      
      
    } if (!token) {
      return next(
          res.status(401).json({
              status:"Fail",
              message:'You are not logged in! Please log in to get access.'
          }));}
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    return decoded;
    }catch(err){
        res.status(400).json({
            status:"Fail",
            message:err.message
        });
    }
}


////Protction  System From Un authorized
exports.protect= async(req,res,next)=>{
  const decoded= await chkLogin(req,res,next); 
  if(decoded){ 
  const currentUser = await user.findById(decoded.id);
if(currentUser.role ==='user' ){
    return next(
        res.status(401).json({
            status:"Fail",
            message:'You are not authorized to get access.'
        })
     
    );}  }
    next();
}
exports.checkUserLogin=async(req,res,next)=>{
    const decoded= await chkLogin(req,res,next); 
    if(decoded == null){
        return next(
            res.status(401).json({
                status:"Fail",
                message:'You are not Login'
            })
         
        );
    }

next();
}


