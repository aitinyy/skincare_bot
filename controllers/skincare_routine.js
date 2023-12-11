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

module.exports = {
    resetValues,
    manageRoutine,
    washFace
};