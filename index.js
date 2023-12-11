"use strict";

const express = require('express');
const bodyParser = require("body-parser");
const app = express();


//app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//const webhookRoute = 
var router = require('./routes/webhook_routes');

app.use(router);

app.listen(process.env.PORT || 8000, function(){
    console.log("Escuchando el puerto");
})