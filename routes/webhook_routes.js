const express = require('express');
const router  = express.Router();
const routineController = require('../controllers/skincare_routine');
const ingredientesController = require('../controllers/ingredientes');
const makeupController = require('../controllers/makeup');


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
        rs = routineController.moreConcerns(res);
    }else if(req.body.queryResult.parameters.decideMoisturizer){
        //decide crema hisdratante
        res = routineController.decideMoisturizer(req, res);
    }else if(req.body.queryResult.parameters.addSunscreen){
        //crema solar, fin rutina
        res = routineController.selectSunscreen(req, res);
    }else if(req.body.queryResult.parameters.ingredients){
        //zona de ingredientes
        res = ingredientesController.manageIngredientsSection(req, res);
    }else if(req.body.queryResult.parameters.coverSkin){
        //zona cubrir maquillaje
        var makeupType=req.body.queryResult.parameters.coverSkin;
        res = makeupController.manageCoveringSkin(req, res, makeupType);
    }else if(req.body.queryResult.parameters.enhanceBeauty){
        //zona realzar maquillaje
        var makeupType2=req.body.queryResult.parameters.enhanceBeauty;
        res = makeupController.manageEnhancingBeauty(req, res, makeupType2);
    }
    else{
        var speech = '¿Disculpa?';

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

module.exports = router;