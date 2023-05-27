import { OpenAIApi, Configuration } from "openai";

const API_KEY = "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";
const configuration = new Configuration({
  apiKey: API_KEY,
});

const openai = new OpenAIApi(configuration);

async function createGptRecipe(ingredients = []) {
  const ingredientsText = ingredients.join(", ");
  const prompt = `Create a recipe from these ingredients: ${ingredientsText}
  Please provide in the following format - 
  name: 
  ingredients:
  instructions:
  servings:
  prepTime:
  cookTime:
 `;
  return askGpt(prompt);
}

async function askGpt(prompt) {
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  return completion.data.choices[0].message.content;
}

export default createGptRecipe;
