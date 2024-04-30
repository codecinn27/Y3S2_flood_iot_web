var express = require('express');
var router = express.Router();
var iot = require('../controllers/iot');

router.route('/dashboard/:id')
    .get(iot.switchCollection);



module.exports = router;
