const { addKeyword } = require('@bot-whatsapp/bot');

/**
 * Función para capturar respuestas del usuario y almacenarlas en un objeto global.
 * @function capturaRespuestas
 * @param {Array<string>} keywords - Palabras clave para activar la captura de respuestas.
 * @returns {Object} - Objeto con métodos para agregar respuestas y lógica de captura.
 */

module.exports = addKeyword(["form"])
    .addAnswer([
        'Hola, si estás aquí es porque deseas tener un crecimiento exponencial para tu empresa.',
        'Para completar el formulario de registro, por favor visita el siguiente enlace:',
        '👉 Formulario de Registro: https://forms.gle/euPr1BqydhzbB7pY9'
    ], null, async (ctx,{endFlow}) => {
        console.log("PARA VER DÓNDE ESTÁ EL NÚMERO DE TELEFONO", ctx)
        GLOBAL_STATE[ctx.form] = {
            nombre_negocio: ctx.body,
        };
        return endFlow({body: 'Adiós'});
    }).addAnswer("Adiós");


let GLOBAL_STATE = {}; // Estado global para almacenar datos de la empresa

