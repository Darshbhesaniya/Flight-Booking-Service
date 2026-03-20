const { StatusCodes } = require('http-status-codes');
const axios = require('axios')

const { BookingRepository } = require('../repositories')
const db = require('../models');
const { ServerConfig } = require('../config');
const AppError = require('../utils/errors/app-error');
const { Enums } = require('../utils/common')
const { BOOKED, CANCELLED } = Enums.BOOKING_STATUS

const bookingRepository = new BookingRepository();

async function createBooking(data) {
    const transaction  = await db.sequelize.transaction();
    try {
        const flight = await axios.get(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}`);
        const flightData = flight.data.data;
        if (data.noOfSeats > flightData.totalSeats) {
          throw  new AppError('Not Enough seats Available', StatusCodes.BAD_REQUEST);
        }

        const totalBillingAmount = data.noOfSeats * flightData.price;
        const bookingPayLoad = {...data, totalCost: totalBillingAmount };
        const booking = await bookingRepository.createBooking(bookingPayLoad, transaction);

       await axios.patch(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}/seats`,{
            seats: data.noOfSeats
        });

       await transaction.commit();
        return booking;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }

}

async function makePayment(data){
       const transaction  = await db.sequelize.transaction();
    try {
        const bookingDetails = await bookingRepository.get(data.bookingId,transaction);
        if(bookingDetails.status == CANCELLED){
             throw  new AppError('The booking has expired', StatusCodes.BAD_REQUEST);
        }
        console.log(bookingDetails);
        const bookingTime = new Date(bookingDetails.createdAt)
        const currentTime = new Date();
        if(currentTime - bookingTime > 300000){
             await bookingRepository.update(data.bookingId, {status: CANCELLED}, transaction);
             throw  new AppError('The booking has expired', StatusCodes.BAD_REQUEST);
        }
        
        if(bookingDetails.totalCost != data.totalCost){
            throw  new AppError('The amount of payment doesnt match', StatusCodes.BAD_REQUEST);
        }
        if(bookingDetails.userId != data.userId){
            throw  new AppError('The user corresponding to the booking doesnt match', StatusCodes.BAD_REQUEST);
        }
        // we assume that payment is successful
        await bookingRepository.update(data.bookingId, {status: BOOKED}, transaction);
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

module.exports = {
    createBooking,
    makePayment
}