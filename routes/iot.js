var express = require('express');
var router = express.Router();
var iot = require('../controllers/iot');

router.route('/dashboard')
    .get(iot.dashboardPage);

module.exports = router;
