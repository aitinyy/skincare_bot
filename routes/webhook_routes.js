const express = require('express');
const router  = express.Router();

const routineController = require('../controllers/skincare_routine');

var multipleConcerns = 0;
var concerns = [];
var typeSkin = 0;

router.post("/", function(req, res){
    

    if(req.body.queryResult.parameters.startRoutine){
        //empezar rutina
        routineController.resetValues(concerns, multipleConcerns, typeSkin);
        res = routineController.manageRoutine(req,res);
    }else if(req.body.queryResult.parameters.removeMakeup){
        //doble wash
        res = routineController.washFace(req,res);
    }else if(req.body.queryResult.parameters.skinConcern){
        //precupaciones del usuario
        res = routineController.selectConcerns(req,res,concerns,multipleConcerns);
        routineController.updateSkinType(req, res, typeSkin, concerns);
    }


});

module.exports = router;