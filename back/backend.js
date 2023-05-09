import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import * as fs from "fs";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

openai
  .createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "You are a AI travel schedule recommender for Japanese.If, user input is Japanese reply in Japanese. Else, reply in English. Answer with a list that starts with 'Day x:' following the day's key destination and only the itineray, nothing else",
        role: "user",
        content: "Plan for a 3 day trip in Japan Tokyo",
      },
    ],
    max_tokens: 10,
  })
  .then((res) => {
    const content = res.data.choices[0].message;
    // const content = res.data.choices;
    const data = JSON.stringify(content);

    try {
      // reading a JSON file synchronously
      fs.writeFileSync("context.json", data);
      console.log("Writing successful!");
    } catch (error) {
      // logging the error
      console.error(error);

      throw error;
    }
    console.log(content);
  });

// const response = await openai.createChatCompletion({
//   model: "gpt-3.5-turbo",
//   messages: [{ role: "user", content: "How are you doing Chat GPT?" }],
// });
// const app = express();
// app.use(cors());
// app.use(express.json());

// app.get("/", (req, res) => {
//   res.status(200).send({ message: "Hello awesome world!" });
// });

// app.post("/", async (req, res) => {
//   try {
//     const prompt = req.body.prompt;

//     const response = await openai.createChatCompletion({
//       model: "gpt-3.5-turbo",
//       messages: [{ role: ""}],
//       temperature: 0,
//       max_tokens: 3000,
//       top_p: 1,
//       frequency_penalty: 0.5,
//       presence_penalty: 0,
//     });

//     res.status(200).send({ bot: response.data.choices[0].text });
//   } catch (error) {
//     console.log(error);

//     res.status(500).send({ error });
//   }
// });

// app.listen(5000, () =>
//   console.log("Server is running on port http://localhost:5000")
// );
