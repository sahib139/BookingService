const { BookingRepository } = require("../repository/index");
const { AppError, ServiceError } = require("../utils/error/index");
const { StatusCodes } = require("http-status-codes");
const { publishMessage } = require("../utils/jobs/messageQueue");
const { REMINDER_BINDING_KEY,FLIGHT_SERVICE_PATH, ADMIN_ACCESS_TOKEN} = require("../config/server-config");

const axios = require("axios");


class BookingService {

    constructor() {
        this.bookingRepository = new BookingRepository();
    }

    async requestForMail(flightDetails, emailId) {
        try {
            const payload = {
                to: emailId,
                subject: "Ticket booked",
                text: "Your ticket has been booked",
                service_id: "SEND_MAIL",
                flightDetail: flightDetails,
            };

            await publishMessage(REMINDER_BINDING_KEY, JSON.stringify(payload));
            return true;
        } catch (error) {
            throw new ServiceError();
        }
    }

    async create(data) {
        try {
            const flightId = data.flightId;
            const getFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;
            console.log(getFlightRequestURL);
            const response = await axios.get(getFlightRequestURL,undefined,{
                headers :{
                    "x-access-token":ADMIN_ACCESS_TOKEN,
                }
            });
            const flightDetails = response.data.data;
            
            if (flightDetails.totalSeats < data.noOfSeats) {
                throw { error: "unable to book the seat due to unavailability of mention no. of seats" };
            }

            const totalCost = flightDetails.price * data.noOfSeats;
            const bookingPayload = { ...data, totalCost };
            const booking = await this.bookingRepository.create(bookingPayload);

            const updateFlightDetailURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;
            await axios.patch(updateFlightDetailURL, { totalSeats: flightDetails.totalSeats - data.noOfSeats },undefined,{
                headers :{
                    "x-access-token":ADMIN_ACCESS_TOKEN,
                }
            });
            const finalBooking = await this.bookingRepository.update(booking.id, { status: "Booked" });

            await this.requestForMail(flightDetails, data.emailId);

            return finalBooking;

        } catch (error) {
            console.log(error);
            return new ServiceError();
        }
    }

}

module.exports = BookingService;