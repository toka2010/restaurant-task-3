const express=require('express');
const cityRoute=express.Router();

const cityController=require('./../Controllers/cityController');

cityRoute.get('/',cityController.getCities);
cityRoute.post('/',cityController.createCity);


module.exports=cityRoute;