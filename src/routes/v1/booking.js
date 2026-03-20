const express = require('express');
const { BookingController } = require('../../controllers');
// const bookingRoutes = require('./booking')

const router = express.Router();

router.post('/',
    BookingController.createBooking
);

// router.use('/bookings',bookingRoutes);

module.exports = router;

