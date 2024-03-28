// const { addKeyword, EVENTS} = require('@bot-whatsapp/bot')
// const aquiFlow = require('./aqui.flow')
// const formFlow = require('./form.flow')
// const serviciosFlow = require('./servicios.flow')
// const presupuestoFlow = require('./presupuesto.flow')


// module.exports= addKeyword([EVENTS.MESSAGE])
//     .addAnswer('🙌 Hola bienvenido a este *Chatbot* *VozFinanzas*')
//     .addAnswer(
//         [
//             'Hola, si estás aquí es porque decesas tener un crecimiento exponencial para tu empresa.',
//             'Menú de opciones:',
//             '👉 *Aquí* para registrarte si es primera vez usando nuestros servicios',
//             '👉 *Form* segunda opción de registro  ',
//             '👉 *Servicios* una asistente le contestará',
//             '👉 *Presupuesto* obtener un estimado del costo de los servicios'
//         ],
//         { capture: true, delay: 1000},
//         null,
//         [aquiFlow, formFlow, serviciosFlow, presupuestoFlow]
//     )
