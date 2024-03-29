const { addKeyword, EVENTS, flowDynamic } = require('@bot-whatsapp/bot');
const { textToVoice } = require("../services/eventlab");

module.exports = addKeyword(EVENTS.ACTION).addAnswer(
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