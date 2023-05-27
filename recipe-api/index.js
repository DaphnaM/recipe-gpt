import express from "express";
import cors from "cors";
import { OpenAIApi, Configuration } from "openai";
import { config } from "dotenv";
config();
const apiKey = process.env.API_KEY;
const configuration = new Configuration({
  apiKey: apiKey,
});

const openai = new OpenAIApi(configuration);

const app = express();
const port = 3001;
app.use(cors());

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
    if you can't come up with a recipe for any reason return false
    `;
    return await askGpt(prompt);
  } catch (error) {
    console.error("Error in createGptRecipe:", error);
    throw error;
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
    console.error("Error in askGpt:", error);
    throw error;
  }
}

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
    console.error("Error in dalleImg:", error);
    throw error;
  }
}

// Define the API route
app.get("/getRecipe", async (req, res) => {
  const { ingredients, specifications } = req.query;
  try {
    const recipe = await createGptRecipe(ingredients, specifications);
    res.json(recipe);
  } catch (error) {
    console.error("Error in /getRecipe:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// API route for dalle
app.get("/getImg", async (req, res) => {
  const prompt = req.query.image;

  try {
    const img = await dalleImg(prompt);

    res.json(img);
  } catch (error) {
    console.error("Error in /getImg:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
