/**
 * Módulos necesarios para el funcionamiento del bot de WhatsApp.
 * @namespace BotWhatsApp
 */
const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot')

// Importación de módulos específicos para el bot de WhatsApp.
const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MongoAdapter = require('@bot-whatsapp/database/mongo')
const { MongoClient } = require('mongodb');

/**
 * URI de la base de datos MongoDB.
 * @type {string}
 */
const MONGO_DB_URI = 'mongodb://localhost:27017'

/**
 * Nombre de la base de datos MongoDB.
 * @type {string}
 */
const MONGO_DB_NAME = 'pruebaDevHe'

/**
 * Función para capturar respuestas del usuario y almacenarlas en un objeto global.
 * @function capturaRespuestas
 * @param {Array<string>} keywords - Palabras clave para activar la captura de respuestas.
 * @returns {Object} - Objeto con métodos para agregar respuestas y lógica de captura.
 */
const capturaRespuestas = addKeyword(["Capturar", "capturar"])
  .addAnswer("Capturare sus respuesta")
  .addAnswer("¿Nombre de su empresa?", { capture: true }, async (ctx) => {
    GLOBAL_STATE[ctx.form] = {
      nombre_negocio: ctx.body,
      ubicacion: "",
      descripcion_servicios: "",
      numero_empleados_proveedores: "",
      metodo_contacto_proveedores: "",
      proceso_registro_gastos_egre: "",
      interes_aplicacion: "",
      conocimiento_registros: "",
      detalle_productos_precios: "",
      duracion_emprendimiento: "",
      estado_formalidad_negocio: "",
    };
  })
  .addAnswer("¿Ubicación de su negocio?", { capture: true }, async (ctx) => {
    GLOBAL_STATE[ctx.form].ubicacion = ctx.body;
  })
/**
 * Agrega respuestas y lógica para capturar información específica de la empresa.
 * @method addRespuestasEmpresa
 * @memberof capturaRespuestas
 * @param {string} pregunta - La pregunta que se realiza al usuario.
 * @param {Object} opciones - Opciones adicionales para la respuesta.
 * @param {boolean} opciones.capture - Indica si se debe capturar la respuesta.
 * @param {function} handler - Función que se ejecuta cuando se recibe la respuesta.
 */
.addAnswer(
  // Pregunta al usuario sobre la descripción de los productos o servicios ofrecidos.
  "¿Descripción de los productos o servicios ofrecidos?",
  { capture: true }, // Indica que se debe capturar la respuesta del usuario.
  async (ctx) => { // Función que se ejecuta cuando se recibe la respuesta.
    GLOBAL_STATE[ctx.form].descripcion_servicios = ctx.body; // Almacena la respuesta en el estado global.
  }
)
.addAnswer(
  // Pregunta al usuario sobre el número de proveedores y empleados.
  "¿Número de proveedores y empleados?",
  { capture: true }, // Indica que se debe capturar la respuesta del usuario.
  async (ctx) => { // Función que se ejecuta cuando se recibe la respuesta.
    GLOBAL_STATE[ctx.form].numero_empleados_proveedores = ctx.body; // Almacena la respuesta en el estado global.
  }
)
.addAnswer(
  // Pregunta al usuario sobre el método de contacto de sus proveedores.
  "¿Método de contacto de sus proveedores?",
  { capture: true }, // Indica que se debe capturar la respuesta del usuario.
  async (ctx) => { // Función que se ejecuta cuando se recibe la respuesta.
    GLOBAL_STATE[ctx.form].metodo_contact_proveedores = ctx.body; // Almacena la respuesta en el estado global.
  }
)
.addAnswer(
  // Pregunta al usuario sobre los procesos para el registro de gastos y egresos.
  "¿Procesos para el registro de sus gastos y egresos?",
  { capture: true }, // Indica que se debe capturar la respuesta del usuario.
  async (ctx) => { // Función que se ejecuta cuando se recibe la respuesta.
    GLOBAL_STATE[ctx.form].proceso_registro_gastos_egre = ctx.body; // Almacena la respuesta en el estado global.
  }
)
.addAnswer(
  // Pregunta al usuario sobre su interés en una aplicación para el registro de gastos.
  [
    "¿Estaría interesado en una aplicación para el registro de gastos?",
    'Esto sería mediante WhatsApp. (Contestas "Sí" o "No")',
  ],
  { capture: true }, // Indica que se debe capturar la respuesta del usuario.
  async (ctx) => { // Función que se ejecuta cuando se recibe la respuesta.
    GLOBAL_STATE[ctx.form].interes_aplicacion = ctx.body; // Almacena la respuesta en el estado global.
  }
)
.addAnswer(
  // Pregunta al usuario sobre su conocimiento acerca de registros contables.
  "¿Tiene conocimiento acerca de registros contables?",
  { capture: true }, // Indica que se debe capturar la respuesta del usuario.
  async (ctx) => { // Función que se ejecuta cuando se recibe la respuesta.
    GLOBAL_STATE[ctx.form].conocimiento_registros = ctx.body; // Almacena la respuesta en el estado global.
  }
)
.addAnswer(
  // Pregunta al usuario sobre el detalle de productos y precios.
  "Detalle de productos y precios",
  { capture: true }, // Indica que se debe capturar la respuesta del usuario.
  async (ctx) => { // Función que se ejecuta cuando se recibe la respuesta.
    GLOBAL_STATE[ctx.form].detalle_productos_precios = ctx.body; // Almacena la respuesta en el estado global.
  }
)
.addAnswer(
  // Pregunta al usuario sobre la duración del emprendimiento.
  "¿Duración del emprendimiento?",
  { capture: true }, // Indica que se debe capturar la respuesta del usuario.
  async (ctx) => { // Función que se ejecuta cuando se recibe la respuesta.
    GLOBAL_STATE[ctx.form].duracion_emprendimiento = ctx.body; // Almacena la respuesta en el estado global.
  }
)
.addAnswer(
  // Pregunta al usuario sobre el estado de formalidad del negocio.
  "¿Estado de formalidad del negocio",
  { capture: true }, // Indica que se debe capturar la respuesta del usuario.
  async (ctx) => { // Función que se ejecuta cuando se recibe la respuesta.
    GLOBAL_STATE[ctx.form].estado_formalidad_negocio = ctx.body; // Almacena la respuesta en el estado global.
  }
)
.addAnswer(
  // Mensaje de confirmación de registro de datos.
  "Perfecto. Estamos registrando sus datos",
  null, // No se captura respuesta adicional.
  /**
   * Lógica para guardar los datos de la empresa en la base de datos.
   * @async
   * @param {Object} ctx - Contexto de la conversación.
   * @param {Object} ctx.flowDynamic - Objeto para manejar el flujo de la conversación.
   */
  async (ctx, { flowDynamic }) => {
    const resultadosStrapi = await guardarEmpresas(GLOBAL_STATE[ctx.form]); // Guarda los datos en la base de datos.
    await flowDynamic( // Envía un mensaje al usuario confirmando el registro.
      `Listo, hemos registrado los datos.`
    );
  }
);

/**
 * Guarda los datos de la empresa en la base de datos MongoDB.
 * @async
 * @function guardarEmpresas
 * @param {Object} inputData - Datos de la empresa a guardar.
 */
const guardarEmpresas = async (inputData) => {
  // Conexión a la base de datos MongoDB local
  const client = new MongoClient(MONGO_DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect(); // Conectar a la base de datos

  try {
    const database = client.db(MONGO_DB_NAME); // Obtener la base de datos
    const collection = database.collection("respuestas_empresas"); // Obtener la colección

    // Insertar el documento en la colección
    const result = await collection.insertOne({ data: inputData });
    console.log(
      `${result.insertedCount} documento(s) insertado(s) con el _id: ${result.insertedId}`
    );
  } finally {
    // Cerrar la conexión
    await client.close();
  }
};

let GLOBAL_STATE = {}; // Estado global para almacenar datos de la empresa

/**
 * Respuestas y lógica para dar la bienvenida al usuario y capturar sus datos.
 * @constant
 * @type {Object}
 */
const bienvenida = addKeyword(EVENTS.WELCOME)
  .addAnswer("Capturemos tus datos") // Mensaje de bienvenida al usuario
  .addAnswer(
    [
      "Escribe la palabra del servicio que te gustaría conocer:",
      "*capturar* para capturar datos",
    ],
    { capture: true, delay: 1000 }, // Captura la respuesta del usuario después de 1 segundo
    null,
    [capturaRespuestas] // Invoca el flujo de captura de respuestas
  );

/**
 * Función principal que inicializa el bot y sus componentes.
 * @async
 * @function main
 */
const main = async () => {
    // Configuración de adaptador para la base de datos MongoDB
    const adapterDB = new MongoAdapter({
        dbUri: MONGO_DB_URI, // URI de la base de datos MongoDB
        dbName: MONGO_DB_NAME, // Nombre de la base de datos
    })
    // Configuración del flujo del bot con la bienvenida y captura de respuestas
    const adapterFlow = createFlow([bienvenida, capturaRespuestas])
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