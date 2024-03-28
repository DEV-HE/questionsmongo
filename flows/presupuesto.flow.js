const { addKeyword} = require('@bot-whatsapp/bot')


module.exports= addKeyword(['presupuesto'])
    .addAnswer(
        [
            '🙁 Lo sentimos por ahora estamos trabajando para ofrecerte el mejor servicio para la generación de esta consulta',
            'Pronto añadiremos un asistente virtual para que puedas obtener un presupuesto totalmente personalizados de nuestros servicios a la medida para tu empresa de bajo costo y con la mejor ',
        ],
        null,
        async (ctx, { capture }) => {
            if (capture === 'presupuesto') {
                ctx.stopFlow(); // Esto detiene la conversación
            }
        },
        null
    )
