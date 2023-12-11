
const manageIngredientsSection = (req, res) => {

    var speech = '';
    var ingredient = req.body.queryResult.parameters.ingredients;

    switch(ingredient){
        case 'Niacinamida':
            speech = data.messagesData[2][1]["text"];
            break;
        case 'Ácido salicílico':
            speech = data.messagesData[2][2]["text"];
            break;
        case 'Vitamina C':
            speech = data.messagesData[2][3]["text"];
            break;
        case 'Ácido hialurónico':
            speech = data.messagesData[2][4]["text"];
            break;
        case 'Ácido glicólico':
            speech = data.messagesData[2][5]["text"];
            break;
        case 'Ácido láctico':
            speech = data.messagesData[2][6]["text"];
            break;
        case 'Ácido mandélico':
            speech = data.messagesData[2][7]["text"];
            break;
        case 'Ceramidas':
            speech = data.messagesData[2][8]["text"];
            break;
        case 'Peróxido de benzoílo':
            speech = data.messagesData[2][9]["text"];
            break;
        case 'Aceite de jojoba':
            speech = data.messagesData[2][10]["text"];
            break;
        case 'Manteca de karité':
            speech = data.messagesData[2][11]["text"];
            break;
        case 'Glicerina':
            speech = data.messagesData[2][12]["text"];
            break;
        case 'Retinoides':
            speech = data.messagesData[2][13]["text"];
            break;
        case 'Vitamina E':
            speech = data.messagesData[2][14]["text"];
            break;
        case 'Aceite de árbol de té':
            speech = data.messagesData[2][15]["text"];
            break;
        case 'Arcilla':
            speech = data.messagesData[2][16]["text"];
            break;
        case 'Ácido succínico':
            speech = data.messagesData[2][17]["text"];
            break;
        case 'Alcohol':
            speech = data.messagesData[2][18]["text"];
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