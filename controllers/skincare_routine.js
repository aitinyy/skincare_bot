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

const selectConcerns = (req, res) => {

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
        speech = 'Podrías añadir a tu rutina algún exfoliante que contenga ácido salicílico (BHA) y/o serum que contenga niacinamida.';
        break;
    case 'Manchas en la piel':
        speech = 'Considera utilizar algún exfoliante AHA, cómo ácido glicólico (el más irritante pero más efectivo) o ácido láctico (punto intermedio) o ácido mandélico (el más suave pero menos efectivo).';
        break;
    case 'Arrugas':
        speech = 'Si quieres tratarlo de forma ligera y suave, el ácido hialurónico es ideal. Lo más efectivo son productos que contengan retinol, pero OJO puede ser un poco irritante, hay que usarlo muy poco a poco.';
        break;
    case 'Poros':
        speech = 'En este caso un exfoliante que contenga ácido salicílico es lo idóneo.';
        break;
    case 'Piel sensible':
        speech = 'En este caso se trata de evitar productos. No utilices ingredientes irritantes como ácido glicólico, ácido salicílico o ácido láctico. Evita los exofoliantes físicos, que son aquellos que contienen pequeñas particulas que se restregan por la piel. También deberías evitar los productos que contengan fragancia y aquellos que contengan alcohol (Aunque no todos los alcoholes son irritantes).';
        break;
    case 'Piel muy seca':
        speech = 'Convienen productos que contengan ceramidas, aceite de jojoba o manteca de karité. Ten en cuenta que este último ingrediente puede ser muy denso y puede obstruir poros, sin embargo, es muy hidratante.';
        break;
    case 'Piel grasa':
        speech = 'Exfoliantes que contengan ácido salicílico ayudan mucho con esta condición ya que disuelven el exceso de sebo. Por otro lado, la niacinamida ayuda a regular la producción de sebo, por lo que también es muy conveniente.';
        break;
    case 'Textura en la piel':
        speech = 'Cuando ocurre este tipo de condición, se recomienda usar ácido glicólico, pero este puede ser un poco irritante. Cómo alternativa está el ácido láctico. Un ingrediente que ayuda con la regeneración de la piel es el retinol, pero si vas a usarlo debes tener precaución.';
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

    var speech = 'En función de tus necesidades, he seleccionado un tipo de crema hidratante para ti.';

    switch(typeSkin){
    case 1:
        speech = speech+' Una crema que sea ligera pero que al mismo tiempo retenga la hidratación. Ingredientes que buscar son la niacinamida y ceramidas, y si se encuentran las dos en el mismo producto mejor.';
        break;
    case 2:
        speech = speech+' Para ti sería adecuado una crema que se sienta grusa y muy hidratante. Ingredientes como las ceramidas son ideales para tu piel.';
        break;
    case 3:
        speech = speech+' Una crema ligera es lo ideal para ti. Sería idóneo que tuviera propiedades que le permitan regular la producción de sebo, con ingredientes como la niacinamida';
        break;
    case 4:
        speech = speech+' Deberías usar una crema que sea muy sencilla, con pocos ingredientes y ningún activo. Evita en todo momento ingredientes como fragancias.';
        break;
    default:
        speech = speech+' Crema hidratante para piel default';
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

    var speech = 'En general el uso de crema solar diario te va a ser muy beneficioso, tanto para protegerse del sol como prevenir multiples condiciones cutáneas.';
    speech = speech + 'Una crema solar que sea hidratante y suave es lo que debes buscar.';

    switch(typeSkin){
        case 3:
            speech = speech + ' Si tu piel se siente muy grasa, puedes saltarte (en algunas ocasiones) la crema hidratante y utilizar únicamente crema solar.';
            break;
        case 4:
            speech = speech + ' Compueba que no tenga muchos productos y que sea adecuada para una piel sensible';
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