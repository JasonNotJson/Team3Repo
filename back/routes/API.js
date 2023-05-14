import { Router } from "express";
import { cleanMemory, cleanReply } from "../common/clean.js";
import Schema from "../models/schema.js";
import BotConfiguration from "../src/botConfig.js";
import GoogleConfiguration from "../src/googleConfig.js";

export class API {
  constructor() {
    this.router = Router();
    this.bot = new BotConfiguration();
    this.gcse = new GoogleConfiguration();
    this.processedMemory = null;
    this.router.get("/", this.getChatLogs.bind(this));
    this.router.get("/ses", this.getSES.bind(this));
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

  async getSES(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-type", "application/json");
    res.setHeader("Connection", "keep-alive");

    const chatId = req.body.chatId;

    const checkTask = (processedMemory) => {
      const requiredProps = [
        "depart",
        "arrivePort",
        "arrivedCountry",
        "departPort",
        "departedCountry",
        "arrive",
        "duration",
      ];
      const checkedProps = requiredProps.every(
        (prop) =>
          processedMemory.hasOwnProperty(prop) &&
          processedMemory[prop] !== null &&
          processedMemory[prop] !== undefined
      );
      return checkedProps;
    };

    const scrape = async () => {};

    const memory = await Schema.find({ chatId: chatId });

    const processedMemory = cleanMemory(memory);
    const taskObj = processDateLoc(processedMemory);

    if (checkTask(taskObj)) {
      scrape().then(() => {
        res.write(
          `data: {keyWords:${taskObj}, booking:${booking}, sky:${sky}, refLinks:${links} `
        );
      });
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
      res.status(200).json({
        message: `Chat logs with chatId ${chatId} deleted successfully.`,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default new API().router;
