import cors from "cors";
import express from "express";
import { BotConfiguration } from "./configs/botConfig.js";

class server_side {
  constructor() {
    this.app = express();
    this.app.use(express.json());
    this.app.use(cors());
    this.port = process.env.PORT || 5000;
    this.bot = new BotConfiguration();
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Server is running on port ${this.port}`);
    });
  }

  post() {
    this.app.post("/", async (req, res) => {
      try {
        const prompt = req.body.prompt;

        const response = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: [{ role: "" }],
          temperature: 0,
          max_tokens: 3000,
          top_p: 1,
          frequency_penalty: 0.5,
          presence_penalty: 0,
        });

        res.status(200).send({ bot: response.data.choices[0].text });
      } catch (error) {
        console.log(error);

        res.status(500).send({ error });
      }
    });
  }
}

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send({ message: "Hello awesome world!" });
});

app.post("/", async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "" }],
      temperature: 0,
      max_tokens: 3000,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
    });

    res.status(200).send({ bot: response.data.choices[0].text });
  } catch (error) {
    console.log(error);

    res.status(500).send({ error });
  }
});

app.listen(5000, () =>
  console.log("Server is running on port http://localhost:5000")
);
