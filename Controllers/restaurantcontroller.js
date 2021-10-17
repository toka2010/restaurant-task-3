const { populate } = require('../Models/cityModel');
const city = require('../Models/cityModel');
const restaurant= require('./../Models/restaurantModel');
const AppError=require('./../utils/appError');
const catchAsync=require('./../utils/catchAsync');

///// Creation..
exports.createRestaurant= async(req,res,next)=>{
   try{
    const newrest= await restaurant.create(req.body);
          res.status(201).json({
            status:'success',
        
            data:{
                Restaurant:newrest
            }});
   }catch(err){
     res.status(400).json({
       status:"Fail",
       message:err.message
     })

   }
 };


///// Get Restaurant

exports.getRestaurant= async(req,res,next)=>{
  try{ 
  const restaurants=await restaurant.find();
    res.status(200).json({
        status:'success',
        data:{
            restaurants  
         }})
        }catch(err){
          res.status(400).json({
            status:"Fail",
            message:err.message
          })
     
        }
        };


   ///////// Search -------->
   exports.searchRestaurant=async(req,res,next)=>{
     try{
    const restaurants=await restaurant.find();
    const search= await  restaurants.filter(el=>el.name.startsWith(req.params.name));
    
    console.log("🚀 ~ file: restaurantcontroller.js ~ line 52 ~ exports.searchRestaurant=async ~ search", search)
    if(search.length ==0){
      return(
      res.status(400).json({
        status:"Fail",
        message:" please enter true name of restaurant "
      }) )
    }
     res.status(200).json({
        status:'success',
        data:{
            search  
         }
    })   }catch(err){
      res.status(400).json({
        status:"Fail",
        message:err.message
      })
 
    }}

   ///uPDAte rest
   exports.updateRestaurant=async(req,res,next)=>{
     try{
    const updat_restaurant = await restaurant.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      });
    console.log("🚀 ~ file: restaurantcontroller.js ~ line 81 ~ exports.updateRestaurant=async ~ updat_restaurant", updat_restaurant)
     
    
        if (!updat_restaurant) {
         return next(
            res.status(404).json({
                status:"fail",
                message:'No restaurant found with that ID'
            }))  }

      res.status(200).json({
        status: 'success',
        data: {
          updat_restaurant
        }
      });   }catch(err){
        res.status(400).json({
          status:"Fail",
          message:err.message
        })
   
      }};

  exports.deleteRestaurant=  async(req,res,next)=>{
    try{
        const updat_restaurant = await restaurant.findByIdAndDelete(req.params.id);
         if (!updat_restaurant) {
                return next(
                res.status(404).json({
                    status:"fail",
                    message:'No restaurant found with that ID'
                }))  }
         res.status(200).json({
            status: 'success',
            data: {
              updat_restaurant
            }
          });
        }catch(err){
          res.status(400).json({
            status:"Fail",
            message:err.message
          })
     
        }
    } ;


        exports.restaurantGroupByCity =async (req, res, next) => {
           try{
            const stats = await restaurant.aggregate([
                {
                     "$match": { "to": city }
                    },
                {
                  $group: {
                    _id: '$city',
                    count : { $sum: 1 },
                   restaurants:{
                    $push: {name:"$name", location:"$location", email:"$email",city:"$city" }
                }},} ]);
             let temp;
            for(let i=0;i<stats.length;i++){
              temp= await city.findById(stats[i]._id.toString());
              stats[i]._id=temp.name;
            }
          
              res.status(200).json({
                status: 'success',
                data: {
                    stats
                }
              });
            }catch(err){
              res.status(400).json({
                status:"Fail",
                message:err.message
              })
         
            }
          } ;



          exports.getDistances = async (req, res, next) => {

            try{
            const { latlng } = req.params;
            
           const unit='mi'
            const [lat, lng] = latlng.split(',');
          
            const multiplier = unit === 'mi' ? 0.000621371 : 0.001;
          
            if (!lat || !lng) {
              next(
                res.status(400).json({
                  status:'fail',
                  message:'Please provide latitutr and longitude in the format lat,lng.'
                })     );   }
          
            const distances = await restaurant.aggregate([
              {
                $geoNear: {
                  near: {
                    type: 'Point',
                    coordinates: [lng * 1, lat * 1],
                    key: "location",},
                  distanceField: 'distance'
                 ,distanceMultiplier: multiplier
                }
              },{
                $group: {
                  _id:{  distanceField: '$distance',
                          name:'$name',
                        location:'$location',  
                                 },
                       minDistance: { $min: '$distance' }} 
                  },
              
               { $limit: 1}, 
              {
                $project: {
                  distance: 1,
                  name: 1
                }
              }
            ]);
              res.status(200).json({
              status: 'success',
              data: {
                data: distances
              }
            });
          }catch(err){
            res.status(400).json({
              status:"Fail",
              message:err.message
            })
       
          }
          }
          