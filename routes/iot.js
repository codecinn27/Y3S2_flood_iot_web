var express = require('express');
var router = express.Router();
var iot = require('../controllers/iot');

router.route('/dashboard/:id')
    .get(iot.switchCollection);

router.route('/datalog/:id')
    .get(iot.dataLogDisplay);

router.route('/notification')
    .get(iot.notificationDisplay);

module.exports = router;
