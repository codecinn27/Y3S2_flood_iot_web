var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('/input',function(req,res,next){
  res.render('crud/input', {title: 'Input data to MongoDB'})
});

router.post('/input', async (req,res)=>{
  try {
      const data = new Data(req.body.data);
      // console.log(data);
      await data.save();
      console.log("Data saved:", data);
      res.status(201).redirect(`/`);
  } catch (error) {
      console.error("Error saving data:", error);
      res.status(500).send("Internal Server Error");
  }
  //res.send(req.body);
});


module.exports = router;
