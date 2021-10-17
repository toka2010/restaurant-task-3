///// Creation..
const city=require('./../Models/cityModel');
const catchAsync = require('./../utils/catchAsync');
exports.createCity= async(req,res,next)=>{
    
    try{
        
        const newcity= await city.create(req.body);
      res.status(201).json({
        status:'success',
    
        data:{
            City:newcity
        }});
    }catch(err){
        res.status(400).json({
          status:"Fail",
          message:err.message
        })
   
      }
    }
/// get cities>>>..
exports.getCities= async(req,res,next)=>{
    try{
    const cities=await city.find();
    res.status(200).json({
        status:'success',
        data:{
            cities   
         }
    })
    
}catch(err){
    res.status(400).json({
      status:"Fail",
      message:err.message
    })

  }
   }

