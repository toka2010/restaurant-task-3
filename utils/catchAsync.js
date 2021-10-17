module.exports = fn => {
  return (req, res, next) => {
    fn(req, res, next).catch(next(err=>{
      res.status(400).json({
        status:"Fail",
        message:err.message
      })


    }));
  };
};
