const { StatusCodes } = require('http-status-codes');

const { Booking } = require('../models/');
const crudRepository = require('./crud-repositry');

class BookingRepository extends crudRepository {
    constructor() {
        super(Booking);
    }


    async createBooking(data, transaction) {
        const response = await Booking.create(data, {transaction: transaction});
        return response;
    }

}

module.exports = BookingRepository;