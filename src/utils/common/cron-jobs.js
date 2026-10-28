const cron = require('node-cron');

const { BookingService } = require('../../services')
console.log("inside Cron Booking Service", BookingService);

function scheduleCrons() {
    cron.schedule('*/5 * * * *', async () => {
        await BookingService.cancelOldBookings();
    });
}


module.exports = scheduleCrons;