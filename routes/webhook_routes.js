const express = require('express');
const router  = express.Router();

const routineController = require('../controllers/skincare_routine');

app.post("/echo", function(req, res){
    if(req.body.queryResult.parameters.startRoutine){
        var speech = 'Hola';

        return res.json({
                "fulfillmentText": speech,
                "fulfillmentMessages": [
                    {
                        "text": {
                            "text": [speech]
                        }
                    }
                ],
                "source": "<webhookpn1>"
            });
    }
});

module.exports = {
    router
};