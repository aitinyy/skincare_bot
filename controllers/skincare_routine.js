const resetValues = (concerns, multipleConcerns, typeSkin) => {
    while(concerns.length){
        concerns.pop();
    }
    multipleConcerns=0;
    typeSkin=0;
}

const manageRoutine = (req,res) => {

    var speech = 'Vamos a empezar tu rutina.';
    var evento = "CLEANSER_START";
            
    return res.json({
        "fulfillmentText": speech,
        "fulfillmentMessages": [
        {
            "text": {
            "text": [speech]
            }
        }
        ],
        "followupEventInput": {
            "name": evento,
            "languageCode": "es-ES"

        },
        "source": "<webhookpn1>"
    });

};

const washFace = (req,res) => {
    var statusWash = req.body.queryResult.parameters.removeMakeup;
    var informationText = '';
    var buttonCallBack = '';
    var infoCallBack = '';

    if(statusWash=='removeMakeup'){
        informationText = 'Es importante quitar el maquillaje correctamente. Se recomiendan los aceites desmaquillantes ya que son muy eficaces a la hora de disolver la suciedad y el maquillaje. Una alternativa menos grasienta es el agua micelar.';
        buttonCallBack = 'washFace';
        infoCallBack = '¿Qué jabón debería utilizar después?';
    }
    else{
        informationText = '¡Usar un jabón de limpieza es esencial! Deberías buscar uno que haga sentir bien a tu piel, en ningún momento debería sentirse tirante. Si tienes la piel un poco más grasa te vas a benificiar de los jabones en gel, de lo contrario uno que sea espumoso va a hacer su trabajo.';
        buttonCallBack = 'skinConcern';
        infoCallBack = '¿Y si quiero tratar algo en concreto?';
    } 

    return res.json({
    "fulfillmentText": '',
    "fulfillmentMessages": [
        {
        "payload": {
            "telegram": {
            "reply_markup": {
                "inline_keyboard": [
                [
                    {
                    "text": infoCallBack,
                    "callback_data": buttonCallBack
                    }
                ]
                ]
            },
            "text": informationText
            }
        },
        "platform": "TELEGRAM"
        }
    ],
    "source": "<webhookpn1>"
    });
}

const selectConcerns = (req, res, concerns, multipleConcerns) => {

    var concern = req.body.queryResult.parameters.skinConcern;
    var moreConcern = ' ¿Tienes alguna preocupación más?';
    var moreThanOne = ' Ten cuidado al tratar varios productos, primero pruebalos por separado.';
    var alreadyDone = false;

    speech = adjustConcern(concern);

    concerns.forEach(element => {
    if(element==concern)
        alreadyDone = true;
    });

    if(!alreadyDone){
        if(multipleConcerns>0){
            speech +=moreThanOne; 
        }
        multipleConcerns = multipleConcerns +1;
        concerns.push(concern);
    }else{
        speech = 'Esta preocupación ya la has dicho.';
    }

    return res.json({
    "fulfillmentText": speech,
    "fulfillmentMessages": [
        {
        "payload": {
            "telegram": {
            "reply_markup": {
                "inline_keyboard": [
                [
                    {
                    "text": 'si',
                    "callback_data": 'si'
                    },
                    {
                    "text": 'no',
                    "callback_data": 'no'
                    },
                ]
                ]
            },
            "text": speech+moreConcern,
            }
            
        },
        "platform": "TELEGRAM"
        }
    ],  
    "source": "<webhookpn1>"
    });
}

const updateSkinType = (req, res, typeSkin, concerns) => {

    //0 -> not set
    //1 -> mostly normal
    //2 -> mostly dry
    //3 -> mostly oily
    //4 -> mostly sensitive
    var sensitive = false;
    var auxType = 0;

    concerns.forEach(element => {
        switch(element){
            case 'Piel muy seca':
                typeSkin = 2;
                break;
            case 'Piel grasa':
                typeSkin = 3;
                break;
            case 'Piel sensible':
                typeSkin = 4;
                sensitive = true;
                break;
            default:
                typeSkin = 1;
                break;
        }
    });

    if(sensitive)
        typeSkin=4;

    concerns.forEach(element => {
        switch(element){
            case 'Acné':
            case 'Poros':
            case 'Textura en la piel':
                if(auxType<=3)
                    auxType=3;
                break;
            case 'Manchas en la piel':
                auxType=4;
                break;
            case 'Arrugas':
                if(auxType<=2)
                    auxType=2;
                break;
        }
    });

    if(typeSkin<auxType)
        typeSkin=auxType;

}

module.exports = {
    resetValues,
    manageRoutine,
    washFace,
    selectConcerns,
    updateSkinType
};