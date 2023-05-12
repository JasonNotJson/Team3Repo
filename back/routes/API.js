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
    this.router.delete("/:chatId", this.deleteChatLog.bind(this));
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
    const userMessage = req.body.message;
    const chatId = req.body.chatId;

    const userChatLog = new Schema({
      chatId: chatId,
      role: "user",
      message: userMessage,
    });
    try {
      await userChatLog.save();

      const memory = await Schema.find({ chatId: chatId });

      const botResponse = await this.bot.chat(userMessage, memory);

      const botChatLog = new Schema({
        chatId: chatId,
        role: "bot",
        message: botResponse,
      });

      await botChatLog.save();

      res.status(201).json(botChatLog);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteChatLog(req, res) {
    const { chatId } = req.params;
    try {
      await Schema.deleteMany({ chatId: chatId });
      res
        .status(200)
        .json({
          message: `Chat logs with chatId ${chatId} deleted successfully.`,
        });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default new API().router;
