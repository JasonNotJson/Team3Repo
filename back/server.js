import cors from "cors";
import express, { response } from "express";
import { BotConfiguration } from "./botConfig.js";
import { GoogleConfiguration } from "./googleConfig.js";

class server_side {
  constructor() {
    this.app = express();
    this.app.use(express.json());
    this.app.use(cors());
    this.port = process.env.PORT || 5000;
    this.bot = new BotConfiguration();
    this.gcse = new GoogleConfiguration();
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Server is running on port ${this.port}`);
    });
  }

  // initiate Chat
  post() {
    this.app.post("/init", async (req, res) => {
      try {
        const response = this.bot.initChat();

        res.status(200).send({ bot: response });
      } catch (error) {
        console.log(error);

        res.status(500).send({ error });
      }
    });
  }

  //Continue Chat
  post() {
    this.app.post("/main", async (req, res) => {
      try {
        const prompt = req.body.prompt;

        const response = this.bot.continueChat(prompt);

        res.status(200).send({ bot: response });
      } catch (error) {
        console.log(error);

        res.status(500).send({ error });
      }
    });
  }
}
