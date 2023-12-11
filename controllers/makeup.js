const manageCoveringSkin = (req, res, makeupType) => {
    var speech = '';
    switch (makeupType){
        case 'Base':
            speech = 'La base se utiliza para tener un tono de piel unificado. Primero habría que preparar la piel con una hidratante y después un primer primer. Continuamos poniendo el producto en la parte posterior de la mano o en alguna otra superficie limpia. Con una esponja de maquillaje ligeramente húmeda, la llenamos de producto a toques. A continuación, hacemos lo mismo en la cara, a toques se va aplicando el maquillaje. Es importante desplazarse de forma uniforme por el rostro para que quede un tono unificado. Repetir hasta que esté cubierta toda la cara.';
            break;
        case 'Primer':
            speech = 'El primer se utiliza para preparar la piel. Se pone después de la crema hidratante. Ayudar a que el maquillaje dure y deja un textura lisa. Para empezar, se necesita un primer que trate algo que le convenga a tu tipo de piel. Se aplica como si fuera una crema.';
            break;
        case 'Corrector':
            speech = 'El corrector debe ser un tono más claro que tu piel. Se puede aplicar antes o después de la base, depende de gusto personal, no altera al resultado. Se utiliza para tapar manchas e imperfecciones que haya por la piel. También se utiliza para ocultar las ojeras.';
            break;
        case 'Correctores de color':
            speech = 'Los correctores de color suelen ayudar a unificar el tono de la piel mediante la teoría del color. El corrector naranja se ocupa de cancelar las zonas más azules/moradas cómo las ojeras, hiperpigmentación o bello facial. Según tu subtono el naranja puede ser más clarito (para subtonos verdes) o más oscuro (para subtonos azules). El corrector verde neutralizada las rojeces. El corrector azul cancela los tonos amarillos. Se pueden mezclar con tu corrector habitual para que luzca más natural.';
            break;
        case 'Cubrir bello':
            speech = 'En primer lugar, hay que afeitar bien la zona y asegurarse que esté bien hidratada y calmada. Luego se aplica un *primer*. Continuamos con un *corrector de color*, y en función de tu subtono se utilizará uno u otro. Subtono *verde* -> color *melocotón*. Subtono *azul* -> color *naranja*. Con una brocha pequeña aplicamos el corrector de color, únicamente donde se vea sombre. A continuación, se aplica *corrector (del tono de tu piel)* por encima. Finalmente se sella con *polvos matificantes*.';
            break;
        case 'BB cream':
            speech = 'Es un tipo de cobertor de la piel que contiene propiedades buenas para la piel. Tiene un poco de color y permite unificar el tono de forma ligera. Suele ser hidratante. Se aplica como si fuera una base. Se puede combinar con otros productos como el corrector o cualquier otro producto que se ocupe de realzar los rasgos faciales.';
            break;
        case 'CC cream':
            speech = 'Esta crema un poco de color y cubre bien, más que las BB creams. Suelen contener ingredientes de interés. Se recomiendo utilizar después de aplicar crema hidratante aunque puede sustituir a esta, preferencia personal. Se puede usar como una base y combinarla con otros productos.';
            break;
        case 'Sellar':
            speech = 'Para sellar el maquillaje se pueden utilizar los polvos matificantes. Se aplican tras completar el maquillaje con un aplicador por todo el rostro. Se deja actuar un momento y se retira con una brocha grande. Otro método es con spray fijador, que tan sólo hay que aplicarlo al acabar el maquillaje.';
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
            speech = 'Hay distintas formas de utilizar el colorete. Para empezar, el tono es gusto personal, pero la posición en la cara va a influir. Para un efecto lifting, se debe aplicar por arriba de los pómulos. Para hacer más pequeña la cara, se debe aplicar en medio de la mejilla.';
            break;
        case 'Bronceador':
            speech = 'El bronceador se utiliza para esculpir el rostro. Debe de ser unos tonos más oscuros a tu piel y se necesita una brocha fina. Se puede usar bajo en los pómulos para marcarlos. En el puente de la nariz, dejando un hueco en medio, para una apariencia más pequeña. También en la parte superior la frente para hacerla más pequeña también. Y en el borde de la mandíbula para hacer la cara más pequeña. ';
            break;
        case 'Iluminador':
            speech = 'El iluminador se utiliza para realzar alguna parte de la cara. Se necesita una brocha pequeña con la que difuminar. Se puede utilizar en el centro de la nariz para hacerla más puntiaguda. También se puede poner en el puente de la nariz, haciendo una sutil línea y da la apariencia la nariz más pequeña. Se puede aplicar un poco en los labios para hacerlos más grandes. En la parte superior del pómulo da un look radiante.';
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