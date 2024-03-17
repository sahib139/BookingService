const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const axios = require("axios");

const {PORT,DB_SYNC} = require("./config/server-config");
const db = require("./models/index");

const {CreateChannel} = require("./utils/jobs/messageQueue");

const ApiRoutes=require("./routes/index");

const setUpAndStartServer= async ()=>{

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended:true}));

    app.use('/', async (req, res, next) => {
        try {
            const response = await axios.post("http://localhost:3001/api/v1/isAuthenticate", undefined,
                {
                    headers: {
                        "x-access-token": req.headers["x-access-token"],
                    }
                }
            );
            if (response.data.success){
                req.body.userId = response.data.data.userId;
                req.body.emailId = response.data.data.emailId;
                next();
            }
        }
        catch (error) {
            return res.json({
                message:"Unauthorized",
            });
        }
    });
    
    app.use('/api',ApiRoutes); 
    app.use('/bookingService/api',ApiRoutes);

    if(DB_SYNC==true){
        await db.sequelize.sync({alter:true});
    }
    
    await CreateChannel();
    
    app.listen(PORT,async ()=>{
        console.log(`Server started at port no. :${PORT}`);
    });
} 

setUpAndStartServer();