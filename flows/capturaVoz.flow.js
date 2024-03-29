const { addKeyword, EVENTS, flowDynamic } = require('@bot-whatsapp/bot');
const { handlerAI } = require("../utils");
const { init } = require("bot-ws-plugin-openai");

const employeesAddonConfig = {
  model: "gpt-3.5-turbo-0301",
  temperature: 0,
  apiKey: process.env.OPENAI_API_KEY,
};
const employeesAddon = init(employeesAddonConfig);


module.exports = addKeyword(EVENTS.VOICE_NOTE).addAction(
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
