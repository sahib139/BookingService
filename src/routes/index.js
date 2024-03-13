const express = require("express");
const router = express.Router();

const ApiRoutesV1=require("./v1/index");

router.use('/v1',ApiRoutesV1);

module.exports=router;