const express = require("express");
const router = express.Router();

const FlightBooking=require("./booking");

router.use(FlightBooking);

module.exports=router;
