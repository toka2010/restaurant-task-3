const app=require('./app');
const dotenv=require('dotenv');
dotenv.config({path:'./config.env'});
const morgan=require('morgan');
const mongoose=require('mongoose');
const user=require('./Models/userModel');


process.on('uncaughtException',err=>{
    console.log(err.name,err.message);
    process.exit(1);
})
//
if(process.env.NODE_ENV=='development'){
    app.use(morgan('dev'));
    }
    const DB=process.env.DATABASE;
    mongoose.connect(DB,{
        useNewUrlParser:true,
        useUnifiedTopology: true
    }).then(con=>{
      
        console.log("connection is successfull DB")
    });

    
    const port=process.env.PORT;
app.listen (port,()=>{
console.log(`connection successfully on port ${port}`);
});




