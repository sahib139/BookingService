const {Booking} = require("../models/index");
const {AppError,ValidationError} = require("../utils/error/index");
const {StatusCodes} = require("http-status-codes");

class BookingRepository{
    
    async create(data){
        try {
            const booking = await Booking.create(data);
            return booking;
        } catch (error) {
            if(error.name="SequelizeValidationError"){
                throw new ValidationError();
            }
            throw new AppError(
                "RepositoryError",
                "Cannot create Booking",
                "There was some issue creating the booking, please try again later",
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        } 
    }

    async update(bookingId,data){
        try {
            await Booking.update(data,{
                where:{
                    id:bookingId,
                },
            });
            return await this.get(bookingId);
        } catch (error) {
            if(error.name="SequelizeValidationError"){
                throw new ValidationError();
            }
            throw new AppError(
                "RepositoryError",
                "Cannot create Booking",
                "There was some issue updating the booking, please try again later",
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        } 
    }

    async get(bookingId){
        try {
            const booking = await Booking.findByPk(bookingId);
            return booking;
        } catch (error) {
            if(error.name="SequelizeValidationError"){
                throw new ValidationError();
            }
            throw new AppError(
                "RepositoryError",
                "Cannot create Booking",
                "There was some issue fetching the booking, please try again later",
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        } 
    }

}

module.exports=BookingRepository;