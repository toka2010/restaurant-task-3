const mongoose=require('mongoose');
const validator=require('validator');
const citySchema= new mongoose.Schema({
name:{
    type:String,
    required:[true,'city must Have aName']
    ,unique:true
   
   
}
});
const city=mongoose.model('City',citySchema);

module.exports= city;