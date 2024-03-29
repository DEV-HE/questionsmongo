require('dotenv').config()
/**
 * Módulos necesarios para el funcionamiento del bot de WhatsApp.
 * @namespace BotWhatsApp
 */
const { createBot, createProvider, createFlow } = require('@bot-whatsapp/bot')

// Importación de módulos específicos para el bot de WhatsApp.
const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MongoAdapter = require('@bot-whatsapp/database/mongo')
const welcomeFlow = require('./flows/welcome.flow')

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


const main = async () => {
    // Configuración de adaptador para la base de datos MongoDB
    const adapterDB = new MongoAdapter({
        dbUri: MONGO_DB_URI, // URI de la base de datos MongoDB
        dbName: MONGO_DB_NAME, // Nombre de la base de datos
    })
    // Configuración del flujo del bot con la bienvenida y captura de respuestas
    const adapterFlow = createFlow([welcomeFlow])
    // const adapterFlow = createFlow([bienvenida])
    // Configuración del proveedor del bot
    const adapterProvider = createProvider(BaileysProvider)
    // Creación del bot con el flujo, proveedor y base de datos configurados
    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })
    // Inicialización del portal web QR
    QRPortalWeb()
}

// Llamada a la función principal para iniciar el bot
main()