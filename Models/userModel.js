const mongoose=require('mongoose');
const validator=require('validator');
const bcrypt= require('bcrypt');
const userSchema= new mongoose.Schema({
name:{
    type:String,
    required:[true,'user must Have aName']
   
   
},
email:{
    type:String,
    required:[true,'user must Have Email'],
    unique:true ,
    validate:[validator.isEmail ,'Please Provide Avalid Email']
},
password:{
    type:String,   
    required:[true,'user must Have password']
} ,
role:{
    type:String,
    enum:['user','admin'],
    default:'user'
}

});

userSchema.pre('save', async function(next){
    /// only run this function if password is actully modified
    if( ! this.isModified('password')) return next();
    // hash the password with cost of 12
    this.password= await bcrypt.hash(this.password, 12);
    // here delete the confirmpassword becouse vo longer needed 
    //this.passwordConfirm=undefined;
    next();
})


userSchema.methods.correctPassword= async function(candidatePassword,userPassword){

    return await bcrypt.compare(candidatePassword,userPassword);
}
const user=mongoose.model('User',userSchema);

module.exports= user;