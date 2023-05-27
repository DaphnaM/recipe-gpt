import express from "express";
import cors from "cors";

//GPTSEVICE
import { OpenAIApi, Configuration } from "openai";

const API_KEY = "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";
const configuration = new Configuration({
  apiKey: API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();
const port = 3001;
app.use(cors());

async function createGptRecipe(ingredients = [], specifications = "") {
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

async function dalleImg(prompt) {
  console.log(prompt);
  if (prompt) {
    const response = await openai.createImage({
      prompt: prompt,
      n: 1,
      size: "256x256",
    });
    console.log("response.data[0].url", response.data.data[0].url);
    return response.data.data[0].url;
  }
}

//dalleImg("pasta with bacon");

// Define the API route
app.get("/getRecipe", async (req, res) => {
  const { ingredients, specifications } = req.query;
  console.lop("/getRecipe speficiations", specifications);
  const recipe = await createGptRecipe(ingredients, specifications);

  res.json(recipe);
});

// API route for dalle
app.get("/getImg", async (req, res) => {
  const prompt = req.query.image;
  console.log(prompt);
  const img = await dalleImg(prompt);
  console.log("img", img);
  res.json(img);
});

//example: http://localhost:3000/getRecipe?ingredients=bacon&ingredients=onion&ingredients=cauliflower

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
