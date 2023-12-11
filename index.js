"use strict";

const express = require('express');
const bodyParser = require("body-parser");
const app = express();


//app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

const webhookRoute = require('./routes/webhook_routes');
//var router = require('./routes/webhook_routes');
app.use('/echo', webhookRoute);
//app.use(webhookRoute);

/*app.post("/echo", function(req, res){
var speech = 'Caca';

return res.json({
    "fulfillmentText": 'um',
    "fulfillmentMessages": [
        {
            "text": {
                "text": [speech]
            }
        }
    ],
    "source": "<webhookpn1>"
});
});*/

app.listen(process.env.PORT || 8000, function(){
    console.log("Escuchando el puerto");
})