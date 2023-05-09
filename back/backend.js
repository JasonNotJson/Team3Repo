import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import * as fs from "fs";
import { systemPrompt, stopWords } from "./scripts.js";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const JSON_FILE = "context.json";
const context = fs.readFileSync(JSON_FILE);
const parsedContext = JSON.parse(context);

const cleanAndAppendReply = (replyObject) => {
  const reply = replyObject.content;
  const cleanedReply = reply
    .replace(/\n/g, "")
    .split(" ")
    .filter((word) => !stopWords.includes(word.toLowerCase()))
    .join(" ")
    .toLowerCase();

  parsedContext.content = parsedContext.content + " " + cleanedReply;
  fs.writeFileSync(JSON_FILE, JSON.stringify(parsedContext, null, 2));
};

const initialChat = async () => {
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: systemPrompt,
        },
      ],
      max_tokens: 100,
    });
    const replyObject = response.data.choices[0].message;
    try {
      cleanAndAppendReply(replyObject);
      console.log("Memory Stored");
    } catch (error) {
      console.log(error);
      throw error;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

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
