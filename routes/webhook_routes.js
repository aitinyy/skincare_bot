const express = require('express');
const router  = express.Router();

const routineController = require('../controllers/skincare_routine');

router.post("/", function(req, res){
    var speech = 'Hola buenasss';
    if(req.body.queryResult.parameters.startRoutine){
        res = routineController.manageRoutine(req,res);
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