const {BookingService} = require("../services/index");
const {StatusCodes} = require("http-status-codes");

const bookingService = new BookingService();

const create = async (req,res)=>{
    try {
        const booking = await bookingService.create(req.body);
        return res.status(StatusCodes.CREATED).json({
            data:booking,
            success:true,
            message:"successful booked a flight",
            err:{},
        });         
    } catch (error) {
        return res.status(error.statusCode).json({
            data:{},
            success:false,
            message:error.message,
            err:error.explanation,
        });
    }
}

module.exports={
    create,
}