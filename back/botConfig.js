import * as dotenv from "dotenv";
import * as fs from "fs";
import {
  initialPrompt,
  conceptPrompt,
  summaryPrompt,
  stopWords,
} from "./configs/scripts.js";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();

export class BotConfiguration {
  constructor() {
    this.configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.openai = new OpenAIApi(this.configuration);
    this.JSON_FILE = "context.json";
    this.fh = fs.readFileSync(this.JSON_FILE);
    this.parsedJson = JSON.parse(this.fh);
    this.context = this.parsedJson.content;
  }

  addMemory(replyObject) {
    const reply = replyObject.content;
    const cleanedReply = reply
      .replace(/\n/g, "")
      .split(" ")
      .filter((word) => !stopWords.includes(word.toLowerCase()))
      .join(" ")
      .toLowerCase();
    const summarizedContext = this.summarizeChat(cleanedReply);

    this.parsedJson.content = this.parsedJson.content + " " + summarizedContext;
    fs.writeFileSync(this.JSON_FILE, JSON.stringify(this.parsedJson, null, 2));
  }

  async initChat() {
    try {
      const response = await this.openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: initialPrompt,
          },
        ],
        max_tokens: 100,
      });

      const replyObject = response.data.choices[0].message;
      const body = replyObject.content;
      this.addMemory(replyObject);
      console.log("Chat initiated Memory Stored");
      return body;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async continueChat(prompt) {
    try {
      const response = await this.openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: conceptPrompt + prompt,
          },
        ],
        max_tokens: 1000,
      });

      const replyObject = response.data.choices[0].message;
      const body = replyObject.content;
      this.addMemory(replyObject);
      console.log(replyObject);
      return body;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async summarizeChat(reply) {
    try {
      const response = await this.openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: summaryPrompt + this.context,
          },
        ],
        max_tokens: 1000,
      });

      const replyObject = response.data.choices[0].message;
      const body = replyObject.content;
      return body;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async startChat() {
    await this.initChat();
  }
}

const testInstance = new BotConfiguration();
testInstance.summarizeChat();
// console.log(testInstance.context);
