const { addKeyword} = require('@bot-whatsapp/bot')


module.exports= addKeyword(['servicios'])
    .addAnswer(
        [
            '🙁 Nos encontramos realizando modificaciones en el catálogo',
            'Pronto añadiremos un asistente virtual para que puedas obtener una explicación clara y detallada de nuestros servicios a la medida para tu empresa de bajo costo y de mayor calidad',
        ],
        null,
        async (ctx, { capture }) => {
            if (capture === 'servicios') {
                ctx.stopFlow(); // Esto detiene la conversación
            }
        },
        null
    )
