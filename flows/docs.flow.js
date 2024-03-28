const { addKeyword } = require('@bot-whatsapp/bot');

// Definición del flujo con un mensaje específico
let docsFlow = addKeyword(['doc', 'documentacion', 'documentación']).addAnswer(
    [
        '📄 Aquí encontrarás la documentación. Recuerda que puedes mejorarla:',
        'https://bot-whatsapp.netlify.app/',
        '\n*2* Para el siguiente paso.',
    ],
    null,
    null,
    null
);

// Almacenamos los mensajes en una propiedad para usarlos en toJSON
docsFlow.messages = [
    '📄 Aquí encontrarás la documentación. Recuerda que puedes mejorarla:',
    'https://bot-whatsapp.netlify.app/',
    '\n*2* Para el siguiente paso.',
];

// Definición del método toJSON para retornar el contenido del mensaje
docsFlow.toJSON = function () {
    // Retorna el contenido de los mensajes definidos en el flujo
    return {
        messages: this.messages
    };
};

module.exports = docsFlow;
