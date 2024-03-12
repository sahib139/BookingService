const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const {PORT,DB_SYNC} = require("./config/server-config");
const db = require("./models/index");

const ApiRoutes=require("./routes/index");

const setUpAndStartServer= async ()=>{

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended:true}));

    app.use('/api',ApiRoutes);

    if(DB_SYNC==true){
        await db.sequelize.sync({alter:true});
    }

    app.listen(PORT,async ()=>{
        console.log(`Server started at port no. :${PORT}`);
    });
} 

setUpAndStartServer();