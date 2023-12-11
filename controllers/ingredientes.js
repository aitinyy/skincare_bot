
const manageIngredientsSection = () => {

    var speech = '';
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

module.exports = {
    manageIngredientsSection
}