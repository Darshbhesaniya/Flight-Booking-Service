const express = require('express');

const { InfoController } = require('../../controllers');
const  bookingRoutes = require('./booking');

const router = express.Router();

router.use('/bookings',bookingRoutes);


router.get('/info', InfoController.info);

module.exports = router;