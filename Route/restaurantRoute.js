const express=require('express');
const restaurantRoute=express.Router();
const restaurantController=require('./../Controllers/restaurantcontroller');
const userController=require('./../Controllers/userController');

restaurantRoute.route('/').get(userController.checkUserLogin ,restaurantController.getRestaurant);
restaurantRoute.route('/search/:name').get(userController.checkUserLogin ,restaurantController.searchRestaurant);
restaurantRoute.route('/').post(userController.protect ,restaurantController.createRestaurant);
restaurantRoute.route('/:id').patch(userController.protect,restaurantController.updateRestaurant);
restaurantRoute.route('/:id').delete(userController.protect,restaurantController.deleteRestaurant);
restaurantRoute.route('/distances/:latlng').get(userController.checkUserLogin ,restaurantController.getDistances);

restaurantRoute.get('/groupByCity',restaurantController.restaurantGroupByCity);
module.exports=restaurantRoute;