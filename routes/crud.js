var express = require('express');
var router = express.Router();
var crud = require('../controllers/crud');

router.route('/input')
    .get(crud.inputPage)
    .post(crud.createNewData);

router.route('/allData')
    .get(crud.readAllData);

router.route('/favoriot')
    .get(crud.readDataFavoriot);

router.route('/getDataFavoriot')
    .get(crud.getDataFavoriot);

router.route('/renderingDataFavoriot')
    .get(crud.renderingDataFavoriot);
// router.route('/favoriot2')
//     .get(crud.readDataFavoriot2);
    
module.exports = router;
