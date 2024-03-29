const { addKeyword, EVENTS } = require('@bot-whatsapp/bot');
// const serviciosFlow = require('./servicios.flow');
// const presupuestoFlow = require('./presupuesto.flow');
const capturarespuestaFlow = require('./capturarespuesta.flow');
const formFlow = require('./form.flow');


module.exports = addKeyword(EVENTS.WELCOME)
    .addAnswer("🙌 Hola, bienvenido a *VozFinanzas Chatbot*") // Mensaje de bienvenida al usuario
    .addAnswer(
        [
            'Si buscas impulsar el crecimiento de tu empresa, estás en el lugar correcto.',
            'Por favor, elige una de las siguientes opciones para continuar:',
            '👉 Escribe *Aquí* si deseas registrarte directamente desde este chat. Es ideal para quienes usan nuestros servicios por primera vez.',
            '👉 Escribe *Form* si prefieres registrarte a través de nuestro formulario de Google. Esta opción es una alternativa de registro.',
            '👉 Escribe *Servicios* para conocer más sobre lo que ofrecemos. Un asistente te proporcionará la información necesaria.',
            '👉 Escribe *Presupuesto* si deseas recibir un estimado sobre el costo de nuestros servicios.',
        ],
        { capture: true, delay: 1000 }, // Captura la respuesta del usuario después de 1 segundo
        async (ctx, { fallBack }) => {
            if (!['Aqui', 'aqui', 'aquí', 'AQUI', 'AQUÍ', 'form', 'FORM', 'Form', 'Servicios', 'servicios', 'SERVICIOS', 'Presupuesto', 'PRESUPUESTO', 'presupuesto'].includes(ctx.body)) {
                return fallBack('No entiendo que quieres decir')
            }
        },
        [capturarespuestaFlow, formFlow] // Invoca el flujo de captura de respuestas
    );
