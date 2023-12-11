const express = require('express');
const router  = express.Router();

const routineController = require('../controllers/skincare_routine');

router.post("/", function(req, res){
    var multipleConcerns = 0;
    var concerns = [];
    var typeSkin = 0;

    if(req.body.queryResult.parameters.startRoutine){
        routineController.resetValues(concerns, multipleConcerns, typeSkin);
        res = routineController.manageRoutine(req,res);
    }else if(req.body.queryResult.parameters.removeMakeup){
        //doble wash
        res = routineController.washFace(req,res);
    }


});

module.exports = router;