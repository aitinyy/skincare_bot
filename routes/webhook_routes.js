const express = require('express');
const router  = express.Router();
const routineController = require('../controllers/skincare_routine');
const ingredientesController = require('../controllers/ingredientes');


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
    }


});

module.exports = router;