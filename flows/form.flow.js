const { addKeyword } = require('@bot-whatsapp/bot');


module.exports = addKeyword(['form'])
    .addAnswer(
        [
            'Hola, si estás aquí es porque deseas tener un crecimiento exponencial para tu empresa.',
            'Para completar el formulario de registro, por favor visita el siguiente enlace:',
            '👉 [Formulario de Registro](https://forms.gle/euPr1BqydhzbB7pY9)'
        ],
        null,
        null
        // async (ctx, { capture }) => {
        //     if (capture === 'form') {
        //         ctx.stopFlow(); // Esto detiene la conversación
        //     }
        // }
        ,
        null,
    );
