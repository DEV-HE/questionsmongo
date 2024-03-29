const { addKeyword } = require('@bot-whatsapp/bot');

/**
 * Función para capturar respuestas del usuario y almacenarlas en un objeto global.
 * @function capturaRespuestas
 * @param {Array<string>} keywords - Palabras clave para activar la captura de respuestas.
 * @returns {Object} - Objeto con métodos para agregar respuestas y lógica de captura.
 */

module.exports = addKeyword(["servicios"])
    .addAnswer([
        '🙁 Nos encontramos realizando modificaciones en el catálogo',
        'Pronto añadiremos un asistente virtual para que puedas obtener una explicación clara y detallada de nuestros servicios a la medida para tu empresa de bajo costo y de mayor calidad',
    ],
    null,
    async (ctx) => {
        ctx.stopFlow();
        GLOBAL_STATE[ctx.form] = {
            nombre_negocio: ctx.body,
        };
    },
    null);

let GLOBAL_STATE = {}; // Estado global para almacenar datos de la empresa


