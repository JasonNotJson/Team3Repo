import * as dotenv from "dotenv";
import * as fs from "fs";
import {
  initialPrompt,
  secretPrompt,
  summaryPrompt,
  continuePrompt,
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
    this.model = "gpt-3.5-turbo";
    this.JSON_FILE = "./context.json";
    this.fh = fs.readFileSync(this.JSON_FILE);
    this.parsedJson = JSON.parse(this.fh);
    this.context = this.parsedJson.content;
    this.memory = this.parsedJson.memory;
  }

  cleanReply(reply) {
    return reply
      .replace(/\n/g, "")
      .split(" ")
      .filter((word) => !stopWords.includes(word.toLowerCase()))
      .join(" ")
      .toLowerCase();
  }

  async addMemory(replyObject, prompt) {
    const reply = replyObject.content;
    const cleanedReply = this.cleanReply(reply);
    this.parsedJson.memory = this.memory + cleanedReply + prompt;
    console.log("Cleaned reply: ", cleanedReply);
    console.log("Updated memory: ", this.memory);

    if (this.context === "") {
      console.log(cleanedReply);
      this.parsedJson.content = this.context + cleanedReply;
    } else {
      console.log("there was context");
      const contextString = this.context + cleanedReply;
      const summarizedContext = await this.memorizeChat(contextString, prompt);

      this.parsedJson.content = this.context + summarizedContext;
    }
    fs.writeFileSync(
      this.JSON_FILE,
      JSON.stringify(this.parsedJson, null, 2),
      (err) => {
        if (err) {
          console.error("there was error");
        } else {
          console.log("success");
        }
      }
    );
  }

  async Chat(prompt) {
    try {
      const secretResponse = await this.openai.createChatCompletion({
        model: this.model,
        messages: [
          {
            role: "user",
            content: this.memory + secretPrompt + prompt,
          },
        ],
        max_tokens: 500,
      });

      const response = await this.openai.createChatCompletion({
        model: this.model,
        messages: [
          {
            role: "user",
            content: continuePrompt + this.context + prompt,
          },
        ],
        max_tokens: 1000,
      });

      const secretReplyObject = secretResponse.data.choices[0].message;
      const replyObject = response.data.choices[0].message;
      const body = replyObject.content;
      const markedPrompt = "'User prompt :" + prompt + "'";
      await this.addMemory(replyObject, markedPrompt);
      console.log("Secret Reply : ");
      console.log(secretReplyObject);
      console.log("Reply : ");
      console.log(replyObject);
      return body;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async memorizeChat(reply, prompt) {
    try {
      const response = await this.openai.createChatCompletion({
        model: this.model,
        messages: [
          {
            role: "user",
            content: summaryPrompt + this.memory + prompt + reply,
          },
        ],
        max_tokens: 3000,
      });

      const replyObject = response.data.choices[0].message;
      const body = replyObject.content;
      console.log("Summary : ");
      console.log(replyObject);
      return body;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // examine use for initial chat
  async initChat() {
    try {
      const response = await this.openai.createChatCompletion({
        model: this.model,
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
      await this.addMemory(replyObject);
      console.log("Chat initiated Memory Stored");
      return body;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

const testInstance = new BotConfiguration();
// testInstance.initChat();
// testInstance.Chat("I want to go to a 3 day tokyo trip");
// testInstance.Chat("I want to go to Tokyo from May 13 to May 15");
testInstance.Chat("What location is a good place to stay in Tokyo?");
// console.log(testInstance.context);
//
