const express = require('express');
const router  = express.Router();
const routineController = require('../controllers/skincare_routine');


router.post("/", function(req, res){
    

    if(req.body.queryResult.parameters.startRoutine){
        //empezar rutina
        routineController.resetValues();
        res = routineController.manageRoutine(req,res);
    }else if(req.body.queryResult.parameters.removeMakeup){
        //doble wash
        res = routineController.washFace(req,res);
    }else if(req.body.queryResult.parameters.skinConcern){
        //precupaciones del usuario
        res = routineController.selectConcerns(req,res);
        routineController.updateSkinType();
    }else if(req.body.queryResult.parameters.moreConcern){
        //continuacion para mas concerns
        //res = routineController.moreConcerns();
        var speech = 'uwi';
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
    }else if(req.body.queryResult.parameters.decideMoisturizer){
        //decide crema hisdratante
        res = routineController.decideMoisturizer(req, res);
    }else if(req.body.queryResult.parameters.addSunscreen){
        //crema solar, fin rutina
        res = routineController.selectSunscreen(req, res);
    }


});

module.exports = router;