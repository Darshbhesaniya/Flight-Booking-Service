const dotenv = require('dotenv');

// const path = require('path')

// dotenv.config({
//      path: path.resolve(__dirname, '../../.env')
// });

dotenv.config();

module.exports = {
    PORT: process.env.PORT,
    FLIGHT_SERVICE: process.env.FLIGHT_SERVICE
}