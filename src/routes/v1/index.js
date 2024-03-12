const express = require("express");
const router = express.Router();

const {FlightBooking}=require();

router.use(FlightBooking);

module.exports=router;
