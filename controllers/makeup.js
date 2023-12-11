const data = require('../database/data');

const manageCoveringSkin = (req, res, makeupType) => {
    var speech = '';
    switch (makeupType){
        case 'Base':
            speech = data.messagesData[3][1]["text"];
            break;
        case 'Primer':
            speech = data.messagesData[3][2]["text"];
            break;
        case 'Corrector':
            speech = data.messagesData[3][3]["text"];
            break;
        case 'Correctores de color':
            speech = data.messagesData[3][4]["text"];
            break;
        case 'Cubrir bello':
            speech = data.messagesData[3][5]["text"];
            break;
        case 'BB cream':
            speech = data.messagesData[3][6]["text"];
            break;
        case 'CC cream':
            speech = data.messagesData[3][7]["text"];
            break;
        case 'Sellar':
            speech = data.messagesData[3][8]["text"];
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

const manageEnhancingBeauty = (req, res, makeupType2) => {

    var speech = '';

    switch (makeupType2){
        case 'Colorete':
            speech = data.messagesData[3][9]["text"];
            break;
        case 'Bronceador':
            speech = data.messagesData[3][10]["text"];
            break;
        case 'Iluminador':
            speech = data.messagesData[3][11]["text"];
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

module.exports = {
    manageCoveringSkin,
    manageEnhancingBeauty
}