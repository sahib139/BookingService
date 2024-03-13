const express = require("express");
const router = express.Router();
const {BookingControllers} = require("../../controllers/index");

router.post('/bookings',BookingControllers.create);

module.exports=router;
