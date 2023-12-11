var multipleConcerns = 0;
var concerns = [];
var typeSkin = 0;

const data = require('../database/data');

const resetValues = () => {
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
        informationText = data.messagesData[1][1]["text"];
        buttonCallBack = 'washFace';
        infoCallBack = '¿Qué jabón debería utilizar después?';
    }
    else{
        informationText = data.messagesData[1][2]["text"];
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

const selectConcerns = (req, res) => {

    var concern = req.body.queryResult.parameters.skinConcern;
    var moreConcern = data.messagesData[1][11]["moreConcern"];
    var moreThanOne = data.messagesData[1][12]["moreThanOne"];
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
                    "text": 'Si',
                    "callback_data": 'si'
                    },
                    {
                    "text": 'No',
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

const adjustConcern = (concern) => {
    var speech = '';

    switch (concern){
    case 'Acné':
        speech = data.messagesData[1][3]["text"];
        break;
    case 'Manchas en la piel':
        speech = data.messagesData[1][4]["text"];
        break;
    case 'Arrugas':
        speech = data.messagesData[1][5]["text"];
        break;
    case 'Poros':
        speech = data.messagesData[1][6]["text"];
        break;
    case 'Piel sensible':
        speech = data.messagesData[1][7]["text"];
        break;
    case 'Piel muy seca':
        speech = data.messagesData[1][8]["text"];
        break;
    case 'Piel grasa':
        speech = data.messagesData[1][9]["text"];
        break;
    case 'Textura en la piel':
        speech = data.messagesData[1][10]["text"];
        break;
    default:
        speech = '¿Disculpa?';
        break;
    }

    return speech;
}

const updateSkinType = () => {

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

const decideMoisturizer = (req, res) => {

    var speech = data.messagesData[1][13]["text"];

    switch(typeSkin){
    case 1:
        speech = speech+data.messagesData[1][14]["text"];
        break;
    case 2:
        speech = speech+data.messagesData[1][15]["text"];
        break;
    case 3:
        speech = speech+data.messagesData[1][16]["text"];
        break;
    case 4:
        speech = speech+data.messagesData[1][17]["text"];
        break;
    default:
        speech = speech+data.messagesData[1][14]["text"];
        break;
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
                    "text": 'Último paso, crema solar',
                    "callback_data": 'addSunscreen'
                    }
                ]
                ]
            },
            "text": speech,
            }
            
        },
        "platform": "TELEGRAM"
        }
    ],
    "source": "<webhookpn1>"
    });

}

const selectSunscreen = (req, res) => {

    var speech = data.messagesData[1][18]["text"];
    speech = speech + data.messagesData[1][19]["text"];

    switch(typeSkin){
        case 3:
            speech = speech + data.messagesData[1][20]["text"];
            break;
        case 4:
            speech = speech + data.messagesData[1][21]["text"];
            break;
    }

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

const moreConcerns = (res) => {

    var speech = 'Más preocupaciones';
    var evento = 'SKIN_CONCERN';

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

}

module.exports = {
    resetValues,
    manageRoutine,
    washFace,
    selectConcerns,
    adjustConcern,
    moreConcerns,
    updateSkinType,
    decideMoisturizer,
    selectSunscreen
};