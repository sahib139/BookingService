const {BookingRepository} = require("../repository/index");
const {AppError,ServiceError} = require("../utils/error/index");
const {StatusCodes} = require("http-status-codes");
const {FLIGHT_SERVICE_PATH} = require("../config/server-config");
const axios = require("axios");


class BookingService{

    constructor(){
        this.bookingRepository=new BookingRepository();
    }

    async create(data){
        try {
            const flightId = data.flightId;
            const getFlightRequestURL=`${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;
            const response = await axios.get(getFlightRequestURL);
            const flightDetails=response.data.data;
            if(flightDetails.totalSeats<data.noOfSeats){
                throw {error:"unable to book the seat due to unavailability of mention no. of seats"};
            }
            
            const totalCost = flightDetails.price * data.noOfSeats;
            const bookingPayload = {...data,totalCost};
            const booking = await this.bookingRepository.create(bookingPayload);

            const updateFlightDetailURL=`${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;
            await axios.patch(updateFlightDetailURL  ,{totalSeats:flightDetails.totalSeats-data.noOfSeats}); 
            const finalBooking = await this.bookingRepository.update(booking.id,{status:"Booked"});

            return finalBooking;

        } catch (error) {
            throw new ServiceError();
        }
    }

}

module.exports=BookingService;