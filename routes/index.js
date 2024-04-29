var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/input',function(req,res,next){
  res.render('input', {title: 'Input data to MongoDB'})
});

// router.post('/input', function(req,res,next){

// })

router.get('/dashboard', function(req,res,next){
  res.render('dashboard');
})

module.exports = router;
