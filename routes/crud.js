var express = require('express');
var router = express.Router();
var crud = require('../controllers/crud');

router.route('/input')
    .get(crud.inputPage)
    .post(crud.createNewData);

router.route('/allData')
    .get(crud.readAllData);
module.exports = router;
