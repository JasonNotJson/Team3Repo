import cors from "cors";
import express from "express";
import * as dotenv from "dotenv";
import router from "./routes/API.js";
import mongoose from "mongoose";

dotenv.config();

class Server {
  constructor() {
    this.app = express();
    this.app.use(express.json());
    this.app.use(cors());
    this.app.use("/chat", router);
    this.port = 5173;
    this.uri = process.env.MONGO_URI;
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
}

const server = new Server();
server.listen();
server.db();
