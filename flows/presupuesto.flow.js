const { addKeyword } = require('@bot-whatsapp/bot');

/**
 * Función para capturar respuestas del usuario y almacenarlas en un objeto global.
 * @function capturaRespuestas
 * @param {Array<string>} keywords - Palabras clave para activar la captura de respuestas.
 * @returns {Object} - Objeto con métodos para agregar respuestas y lógica de captura.
 */

module.exports = addKeyword(["presupuesto"])
    .addAnswer([
        '🙁 Lo sentimos por ahora estamos trabajando para ofrecerte el mejor servicio para la generación de esta consulta',
        'Pronto añadiremos un asistente virtual para que puedas obtener un presupuesto totalmente personalizados de nuestros servicios a la medida para tu empresa de bajo costo y con la mejor ',
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

