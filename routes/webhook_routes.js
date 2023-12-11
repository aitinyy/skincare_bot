const express = require('express');
const router  = express.Router();

//const routineController = require('../controllers/skincare_routine');

router.post("/", function(req, res){
    var speech = 'Hola buenasss';
    if(req.body.queryResult.parameters.startRoutine){
        speech = 'Empezamos rutina';

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
});

module.exports = router;