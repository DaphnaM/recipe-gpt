import { OpenAIApi, Configuration } from "openai";

const { Configuration, OpenAIApi } = require("openai");

const openai = new OpenAIApi(configuration);
async function dalleImg(prompt) {
  try {
    if (prompt) {
      const response = await openai.createImage({
        prompt: prompt,
        n: 1,
        size: "256x256",
      });
      return response.data.data[0].url;
    }
  } catch (error) {
    console.error(error);
  }
}

export { dalleImg };
