require('dotenv').config()
/**
 * Módulos necesarios para el funcionamiento del bot de WhatsApp.
 * @namespace BotWhatsApp
 */
const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot')

// Importación de módulos específicos para el bot de WhatsApp.
// const QRPortalWeb = require('@bot-whatsapp/portal')
const Queue = require('queue-promise')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MongoAdapter = require('@bot-whatsapp/database/mongo')
const welcomeFlow = require('./flows/welcome.flow')
const { init } = require("bot-ws-plugin-openai");
const MockAdapter = require("@bot-whatsapp/database/mock");
// CHECAR
// const capturaVozFlow = require('./flows/capturaVoz.flow')
const ServerHttp = require('./src/http')
const ChatwootClass = require('./src/chatwoot/chatwoot.class')
const { handlerMessage } = require('./src/chatwoot')
const PORT = process.env.PORT ?? 3001

const { handlerAI } = require("./utils");
const { textToVoice } = require("./services/eventlab");

const serverHttp = new ServerHttp(PORT)
const chatwoot = new ChatwootClass({
  account:process.env.CHATWOOT_ACCOUNT_ID,
  token:process.env.CHATWOOT_TOKEN_ID,
  endpoint:process.env.CHATWOOT_ENDPOINT_ID
})

const queue = new Queue({
  concurrent:1,
  interval:500
})

const employeesAddonConfig = {
  model: "gpt-3.5-turbo-0301",
  temperature: 0,
  apiKey: process.env.OPENAI_API_KEY,
};

const employeesAddon = init(employeesAddonConfig);


const flowStaff = addKeyword(EVENTS.ACTION).addAnswer(
  ["Claro que te interesa?", "mejor te envio audio.."],
  null,
  async (ctx, { flowDynamic, state, provider }) => {
    console.log("🙉 texto a voz....");
    try {
      const currentState = state.getMyState();
      const path = await textToVoice(currentState.answer);
      console.log(`🙉 Fin texto a voz....[PATH]:${path}`);
      // await flowDynamic({ body: "escucha", media: path });

      const id = ctx.key.remoteJid
      const sock = await provider.getInstance()
      await sock.sendMessage(
        id, 
        { audio: { url: path}, mimetype: 'audio/mp4'},
        // { url: path }, // can send mp3, mp4, & ogg
      )

    } catch (error) {
      if (error) {
        console.error("Error en flowStaff:", error);
      } else {
        console.error("Error en flowStaff: El error es undefined, revisa la función textToVoice.");
      }
    }
  }
);

const flowVoiceNote = addKeyword(EVENTS.VOICE_NOTE).addAction(
  async (ctx, ctxFn) => {
    try {
      await ctxFn.flowDynamic("dame un momento para escucharte...🙉");
      console.log("🤖 voz a texto....");
      const text = await handlerAI(ctx);
      console.log(`🤖 Fin voz a voz a texto....[TEXT]: ${text}`);
      const currentState = ctxFn.state.getMyState();
      const fullSentence = `${currentState?.answer ?? ""}. ${text}`;
      const { employee, answer } = await employeesAddon.determine(fullSentence);
      ctxFn.state.update({ answer });
      employeesAddon.gotoFlow(employee, ctxFn);
    } catch (error) {
      console.error("Error en flowVoiceNote:", error);
    }
  }
);


// add
/**
 * URI de la base de datos MongoDB.
 * @type {string}
 */
const MONGO_DB_URI = process.env.MONGO_DB_URI;

/**
 * Nombre de la base de datos MongoDB.
 * @type {string}
 */
const MONGO_DB_NAME = process.env.MONGO_DB_NAME;

/* FIN CAPTURA */


const main = async () => {
    // Configuración de adaptador para la base de datos MongoDB
    const adapterDB = new MongoAdapter({
        dbUri: MONGO_DB_URI, // URI de la base de datos MongoDB
        dbName: MONGO_DB_NAME, // Nombre de la base de datos
    })
    // Configuración del flujo del bot con la bienvenida y captura de respuestas
    // const adapterFlow = createFlow([flowPrincipal])
    const adapterFlow = createFlow([welcomeFlow, flowVoiceNote, flowStaff])
    // Configuración del proveedor del bot
    const adapterProvider = createProvider(BaileysProvider)

      /**
   * 🤔 Empledos digitales
   * Imaginar cada empleado descrito con sus deberes de manera explicita
   */
  const employees = [
    {
      name: "SOY HÉCTOR Y TE PUEDO AYUDAR CON TUS FINANZAS",
      description:
        "Soy un representante de VOZ FINANZAS, una empresa que brinda soluciones integrales de alto valor para el crecimiento y gestión eficiente de tu negocio. Ofrecemos servicios avanzados de contabilidad y facturación, gestión de trámites para el registro de marcas y constitución de sociedades, así como evaluaciones exhaustivas de archivos y asesoramiento contable personalizado. Nuestro enfoque está en optimizar tu operación comercial, asegurando que cada aspecto de tu gestión financiera sea impecable. Además, te brindamos herramientas para la toma de decisiones estratégicas, apoyo en la planificación fiscal y estrategias para mejorar la eficiencia operativa. Nuestro equipo de expertos está comprometido con ofrecer soluciones a medida que se adaptan a las necesidades únicas de tu empresa, garantizando no solo el cumplimiento de las obligaciones legales y fiscales sino también impulsando el crecimiento sostenible de tu negocio. Con VOZ FINANZAS, obtienes un aliado estratégico que utiliza la última tecnología y las mejores prácticas del sector para darte una ventaja competitiva en el mercado. Estamos aquí para resolver cualquier duda y ayudarte a navegar los desafíos de tu empresa con confianza y éxito.",
      flow: flowStaff,
    },
    {
      name: "not employee",
      description: "Esta pregunta no está relacionada con nuestro negocio. ¿En qué puedo ayudarte en relación a nuestros servicios financieros?",
      flow: flowStaff
    },
    {
      name: null,
      answer: "Lo siento, ha ocurrido un error inesperado. Por favor, inténtalo de nuevo más tarde",
      flow: flowStaff
    }
  ];

  employeesAddon.employees(employees);

    // Creación del bot con el flujo, proveedor y base de datos configurados
    const bot = await createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })


    serverHttp.initialization(bot)

    // Los mensajes entrantes al bot (cuando el cliente nos escribe)
    adapterProvider.on('message', (payload) => {
      queue.enqueue(async () => {
        await handlerMessage({
            phone:payload.from,
            name:payload.pushName,
            message:payload.body,
            mode:'incoming'
        }, chatwoot)
      });
    })
    
    // Los mensajes salientes (cuando contesta el bot)
    bot.on('send_message', (payload) => {
      queue.enqueue(async () => {
        await handlerMessage({
          phone:payload.numberOrId,
          name:payload.pushName,
          message:payload.answer,
          mode:'outgoing'
      }, chatwoot)
      });
    })


    // Inicialización del portal web QR
    // QRPortalWeb()
}

// Llamada a la función principal para iniciar el bot
main()