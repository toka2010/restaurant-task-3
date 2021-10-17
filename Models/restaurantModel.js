const mongoose=require('mongoose');
const validator=require('validator');
const city = require('./cityModel');
const restaurantSchema= new mongoose.Schema({
name:{
    type:String,
    required:[true, 'restaurant must have aname']
},
image:String,
email:{
    type:String,
    required:[true,'restaurant must Have Email'],
    unique:true ,
    validate:[validator.isEmail ,'Please Provide Avalid Email']
},
location:{
    type:{
        type:String,
        default:'Point',
        enum:['Point']
    },
    coordinates:[Number],
    address:String,
    description:String
},
city:{
    type:mongoose.Schema.ObjectId,
    ref:'City'
}
        


},{
    toJSON: { virtuals:true },
    toObject:{ virtuals:true }
});
restaurantSchema.index({ location: '2dsphere' });
restaurantSchema.pre(/^find/,function(next){
    this.populate('city');
   
       next();
   })
   
restaurantSchema.methods.getcityname= async function(obj){
    const citiessPromises= this.obj.map(async el=> await city.findById(el._id.toString()));
    const gg=await Promise.all(citiessPromises);

return gg;

}
const restaurant=mongoose.model('Restaurant',restaurantSchema);
module.exports=restaurant;