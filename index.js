"use strict";

const express = require('express');
//const bodyParser = require("body-parser");
const app = express();
//const router  = express.Router();

//app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.json());

const webhookRoute = require('./routes/webhook_routes');

app.use(webhookRoute.router);

app.listen(process.env.PORT || 8000, function(){
    console.log("Escuchando el puerto");
})