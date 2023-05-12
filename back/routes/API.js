import { Router } from "express";
import Schema from "../models/schema.js";
import { BotConfiguration } from "../src/botConfig.js";
import { GoogleConfiguration } from "../src/googleConfig.js";

export class API {
  constructor() {
    this.router = Router();
    this.bot = new BotConfiguration();
    this.gcse = new GoogleConfiguration();

    this.router.get("/", this.getChatLogs.bind(this));
    this.router.post("/", this.postChatLog.bind(this));
    this.router.delete("/:id", this.deleteChatLog.bind(this));
  }

  async getChatLogs(req, res) {
    try {
      const chatLogs = await Schema.find();
      res.send(chatLogs);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async postChatLog(req, res) {
    const chatLog = new Schema({
      chatId: req.body.chatId,
      role: req.body.role,
      message: req.body.message,
    });
    try {
      const newChatLog = await chatLog.save();
      res.status(201).json(newChatLog);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  deleteChatLog(req, res) {
    // Your logic for DELETE requests
  }
}

export default new API().router;
