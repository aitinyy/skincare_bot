"use strict";

const express = require('express');
const bodyParser = require("body-parser");
const app = express();

//app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

var multipleConcerns = 0;
var concerns = [];
var typeSkin = 0;

app.post("/echo", function(req, res){
    var speech = '';
    var evento = '';

    if(req.body.queryResult && req.body.queryResult.parameters){
        if(req.body.queryResult.parameters.startRoutine){
            //empezamos la rutina
            resetValues();
            startRoutine();
        }else if(req.body.queryResult.parameters.removeMakeup){
            //doble wash
            washFace();
        }else if(req.body.queryResult.parameters.skinConcern){
            //precupaciones del usuario
            selectConcerns();
            updateSkinType();
        }else if(req.body.queryResult.parameters.moreConcern){
            //continuacion para mas concerns
            moreConcerns();
        }else if(req.body.queryResult.parameters.decideMoisturizer){
            //decide crema hisdratante
            decideMoisturizer();
        }else if(req.body.queryResult.parameters.addSunscreen){
            //crema solar, fin rutina
            selectSunscreen();
        }else if(req.body.queryResult.parameters.ingredients){
            //zona de ingredientes
            manageIngredientsSection();
        }else if(req.body.queryResult.parameters.coverSkin){
            //zona maquillaje covertor
            var makeupType=req.body.queryResult.parameters.coverSkin;
            manageCoveringSkin(makeupType);
            //gestionar 
        }else if(req.body.queryResult.parameters.enhanceBeauty){
            //zona maquillaje covertor
            var makeupType2=req.body.queryResult.parameters.enhanceBeauty;
            manageEnhancingBeauty(makeupType2);
            //gestionar 
        }
        else{
            speech = '¿Disculpa?';

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
    }

    function resetValues(){
        while(concerns.length){
            concerns.pop();
        }
        multipleConcerns=0;
        typeSkin=0;
    }

    function startRoutine(){
        speech = 'Vamos a empezar tu rutina.';
        evento = "CLEANSER_START";
            
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
                /*"parameters": {
                "param-name": "param-value"
                }*/
            },
            "source": "<webhookpn1>"
        });
    }

    function washFace(){
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

    function selectConcerns(){
        //speech = 'la preocupacion es '+req.body.queryResult.parameters.skinConcern;
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

    function adjustConcern(concern){
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

    function moreConcerns(){

        speech = 'Más preocupaciones';
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

    function updateSkinType(){
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

    function decideMoisturizer(){

        speech = 'En función de tus necesidades, he seleccionado una crema hidratante para ti.';

        switch(typeSkin){
        case 1:
            speech = speech+' Crema hidratante para piel normal';
            break;
        case 2:
            speech = speech+' Crema hidratante para piel seca';
            break;
        case 3:
            speech = speech+' Crema hidratante para piel grasa';
            break;
        case 4:
            speech = speech+' Crema hidratante para piel sensible';
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
                        "text": 'Crema solar',
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

    function selectSunscreen(){

        speech = 'Crema solar final';

        switch(typeSkin){
        case 1:
            speech = 'Crema solar para piel normal';
            break;
        case 2:
            speech = 'Crema solar para piel seca';
            break;
        case 3:
            speech = 'Crema solar para piel grasa';
            break;
        case 4:
            speech = 'Crema solar para piel sensible';
            break;
        default:
            speech = 'Crema solar para piel default';
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

    function manageIngredientsSection(){

        speech = 'Explicamos que es '+req.body.queryResult.parameters.ingredients+'. ';
        speech += '¿Te interesa conocer algún ingrediente más?';

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
                        "callback_data": 'ingredientes'
                        },
                        {
                        "text": 'No',
                        "callback_data": 'no'
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

    function manageCoveringSkin(makeupType){
        switch (makeupType){
            case 'Base':
                speech = 'Hablamos de la base';
                break;
            case 'Primer':
                speech = 'Hablamos del primer';
                break;
            case 'Cubrir':
                speech = 'Hablamos de cubrir bello';
                break;
            case 'Corrector':
                speech = 'Hablamos de los correctores';
                break;
            default:
                speech = '¿Disculpa?';
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

    function manageEnhancingBeauty(makeupType2){

        switch (makeupType2){
            case 'Colorete':
                speech = 'Hablamos del colorete';
                break;
            case 'Bronceador':
                speech = 'Hablamos del bronceador';
                break;
            default:
                speech = '¿Disculpa?';
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

});

app.listen(process.env.PORT || 8000, function(){
    console.log("Escuchando el puerto");
})