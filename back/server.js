import cors from "cors";
import express, { response } from "express";
import * as dotenv from "dotenv";
import { router } from "./routes/API.js";
import mongoose from "mongoose";
import { MongoClient, ServerApiVersion } from "mongodb";
import { BotConfiguration } from "./src/botConfig.js";
import { GoogleConfiguration } from "./src/googleConfig.js";

dotenv.config();

class Server {
  constructor() {
    this.app = express();
    this.app.use(express.json());
    this.app.use(cors());
    this.app.use("/chat", router);
    this.port = 5000;
    this.uri = process.env.MONGO_URI;
    this.bot = new BotConfiguration();
    this.gcse = new GoogleConfiguration();
  }

  db() {
    console.log("connecting to db");

    mongoose
      .connect(this.uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => console.log("Database Connected"))
      .catch((error) =>
        console.error("Error while connecting to MongoDB:", error.message)
      );

    const db = mongoose.connection;

    db.on("error", console.error.bind(console, "MongoDB connection error:"));
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

        const response = this.bot.Chat(prompt);

        res.status(200).send({ bot: response });
      } catch (error) {
        console.log(error);

        res.status(500).send({ error });
      }
    });
  }
}

const server = new Server();
server.listen();
server.db();
