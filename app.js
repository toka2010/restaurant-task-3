const express=require('express');
const app=express();
app.use(express.json());
const morgan= require('morgan');
app.use(morgan('dev'));
const user=require('./Models/userModel');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./Controllers/errorController');
const cityController=require('./Controllers/cityController');
const restaurantController=require('./Controllers/restaurantcontroller');
const userController=require('./Controllers/userController');
const swaggerUi=require('swagger-ui-express');
const YAML=require('yamljs')
const swaggerJSDoc = YAML.load('./api.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJSDoc));
//city with swagger
app.get('/cities',cityController.getCities);
app.post('/createcity',userController.checkUserLogin,cityController.createCity);

////restaurant
app.get('/restaurants',restaurantController.getRestaurant);
app.get('/restaurant/groupByCity',restaurantController.restaurantGroupByCity);
app.post('/createrestaurant',restaurantController.createRestaurant);
app.get('/restaurant/search/:name',restaurantController.searchRestaurant);
app.delete('/restaurant/delete/:id',restaurantController.deleteRestaurant);
///restaurant/delete/{restid}
///distances/:latlng/unit/:unit'
app.get('/restaurants/distances/:latlng',restaurantController.getDistances);
app.put('/restaurants/update/:id',restaurantController.updateRestaurant);
//user
app.post('/signup',userController.signup);
app.post('/login',userController.logIn);



// /restaurants
// Routing>>>>>
//user

const userRoute=require('./Route/userRoute');
app.use('/api/users',userRoute);
//restaurant
const restaurantRoute=require('./Route/restaurantRoute');
app.use('/api/restaurants',restaurantRoute);
//city
const cityRoute=require('./Route/cityRoute');
app.use('/api/cities',cityRoute);

///////////////Admin Creation////////////
const Admin_obj={
    name:"Admin",
    role:'admin',
    email:'admin@gmail.com',
    password:'aa123456'}
const createAdmin= async()=>{

const admin= await user.findOne({email:Admin_obj.email});  
if(!admin){
    const dummyAdmin= new user(Admin_obj);
    dummyAdmin.save().then(doc =>{
       console.log('Admin Created');
    }).catch(err =>{
        console.log("Error"+err);
    
    }) 
    
}}

createAdmin();

//Error Handelling
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
  });
  
  app.use(globalErrorHandler);



module.exports=app;