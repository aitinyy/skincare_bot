const manageRoutine = (req,res) => {

    var speech = 'Hola';

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
};

module.exports = {
    manageRoutine
};