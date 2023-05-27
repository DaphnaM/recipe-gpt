import { OpenAIApi, Configuration } from "openai";

const openai = new OpenAIApi(configuration);

async function createGptRecipe(ingredients = [], specifications = "") {
  try {
    const ingredientsText = ingredients.join(", ");
    const prompt = `Create a recipe from these ingredients: ${ingredientsText}
    Please provide in the following format -
    Name:
    Ingredients:
    Instructions:
    Servings: {number}
    Prep Time: {number}
    Cook Time: {number}
    ${specifications}
    if you can't comeup with a recipe for any reason return false
    `;
    return askGpt(prompt);
  } catch (error) {
    console.error(error);
  }
}

async function askGpt(prompt) {
  try {
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
  } catch (error) {
    console.error(error);
  }
}

export { createGptRecipe };
