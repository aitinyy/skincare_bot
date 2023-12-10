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
            //zona cubrir maquillaje
            var makeupType=req.body.queryResult.parameters.coverSkin;
            manageCoveringSkin(makeupType);
        }else if(req.body.queryResult.parameters.enhanceBeauty){
            //zona realzar maquillaje
            var makeupType2=req.body.queryResult.parameters.enhanceBeauty;
            manageEnhancingBeauty(makeupType2);
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

        speech = 'En función de tus necesidades, he seleccionado un tipo de crema hidratante para ti.';

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

    function selectSunscreen(){

        speech = 'En general el uso de crema solar diario te va a ser muy beneficioso, tanto para protegerse del sol como prevenir multiples condiciones cutáneas.';
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

    function manageIngredientsSection(){

        var ingredient = req.body.queryResult.parameters.ingredients;

        switch(ingredient){
            case 'Niacinamida':
                speech = 'La niacinamida regula la producción de sebo. Es buena para las pieles con tendencia a tener acné. También para aquellas que padezcan de manchas.';
                break;
            case 'Ácido salicílico':
                speech = 'El ácido salicílico (BHA) ayuda a disminuir la apariencia de los poros. También es bueno para las pieles con acné. Puede llegar a ser un poco irritante y sensibilizar la piel, por lo que no es para todo el mundo. Si se usa, es muy importante protegerse con crema solar por las mañanas. ';
                break;
            case 'Vitamina C':
                speech = 'La vitamina C, también conocida por otros nombres como ácido ascórbico, ayuda con la luminosidad y la hiperpigmentación (desaparición de manchas) de la piel. ayuda a que la piel sufra menos daños. contribuye a la producción de colágeno. También ayuda con la protección contra el sol, pero esto no significa que no haya que llevar crema solar.';
                break;
            case 'Ácido hialurónico':
                speech = 'El ácido hialurónico ayuda a hidratar la piel. También es beneficioso para el tratamiento de líneas de expresión.';
                break;
            case 'Ácido glicólico':
                speech = 'El ácido glicólico (AHA) es un exfoliante que ayuda con la pigmentación de la piel. Contribuye con la igualación del tono de la piel. También es bueno para tratar las pieles con textura. Puede llegar a irritar pieles sensibles, pero es muy efectivo. Alternativas a este ingrediente son el ácido láctico y el ácido mandélico. Es importante usar crema solar si se usan productos con este ingrediente.';
                break;
            case 'Ácido láctico':
                speech = 'El ácido láctico (AHA) es un tipo de exfoliante químico. Trabaja en la superficie de la piel y se ocupa de igualar el tono. Es menos irritante que el ácido glicólico, pero aun así puede ser un poco molesto para pieles sensibles. La alternativa más suave es el ácido mandélico. Es importante usar crema solar si se usan productos con ingredientes como este.';
                break;
            case 'Ácido mandélico':
                speech = 'El ácido mandélico (AHA) es el exfoliante químico del grupo de los AHA más suave. Ayuda con la desaparición de manchas, pero trabaja más lento. Es importante usar crema solar si se usan productos con este ingrediente.';
                break;
            case 'Ceramidas':
                speech = 'Las ceramidas ayudan a hidratar la piel. Por lo general son buenas para todas las pieles, sobre todo aquellas secas o incluso sensibles.';
                break;
            case 'Peróxido de benzoílo':
                speech = 'El peróxido de benzoílo ayuda a tratar las pieles que sufren de acné. Puede ser irritante para pieles más sensibles. El uso de crema solar es muy importante. ';
                break;
            case 'Aceite de jojoba':
                speech = 'El aceite de jojoba ayuda con la hidratación de la piel. Es apto para todo tipo de pieles incluida la piel con tendencia acneica.';
                break;
            case 'Manteca de karité':
                speech = 'La manteca de karité es ideal para hidratar aquellas pieles que son secas o muy secas. Se suele sentir muy densa en la piel.';
                break;
            case 'Glicerina':
                speech = 'La glicerina es uno de los ingredientes más comunes. Ayuda a hidratar la piel, reparar la barrera cutánea e incluso puede ayudar con las líneas de expresión.';
                break;
            case 'Retinoides':
                speech = 'Los retinoides, también conocido como vitamina A, retinol, adapalene y tretinoin, se ocupan de la regeneración de las células cutáneas. Ayudan con la hiperpigmentación de la piel, acné e incluso arrugas. Adapalene es la opción más apta para piel sensible. Hay que tener extremo cuidado con el sol, por lo que el uso de crema solar debería ser imprescindible.';
                break;
            case 'Vitamina E':
                speech = 'La vitamina E es un antioxidante. Este ingrediente se encarga de proteger la piel de daños de la radiación ultravioleta. Ayuda con el tema del envejecimiento de la piel, ya que protege el colágeno.';
                break;
            case 'Aceite de árbol de té':
                speech = 'El aceite de árbol de té ayuda a tratar el acné, pero puede ser un poco irritante.';
                break;
            case 'Arcilla':
                speech = 'Este ingrediente se suele usar para absorber el exceso de sebo de la piel.';
                break;
            case 'Ácido succínico':
                speech = 'El ácido succínico es un exfoliante que ayuda a las pieles con tendencia acneica y a la disminución de apariencia de poros. Además, es más suave que otros exfoliantes y por lo que es apto para pieles sensibles.';
                break;
            case 'Alcohol':
                speech = 'Algunos de los tipos del alcohol pueden ser irritantantes para la piel como el alcohol denat, sobretodo para la gente con piel sensible.';
                break;
            default:
                speech = 'Ups algo ha ido mal';
                breack;
        }

        //speech = 'Explicamos que es '+req.body.queryResult.parameters.ingredients+'. ';
        speech = speech + ' ¿Te interesa conocer algún ingrediente más?';

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