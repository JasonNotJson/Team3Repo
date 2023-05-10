import * as dotenv from "dotenv";
import * as fs from "fs";
import * as scripts from "./scripts.js";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();

export class BotConfiguration {
  constructor() {
    this.configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.openai = new OpenAIApi(this.configuration);
    this.JSON_FILE = "context.json";
    this.context = fs.readFileSync(this.JSON_FILE);
    this.parsedContext = JSON.parse(this.context);
  }

  addMemory(replyObject) {
    const reply = replyObject.content;
    const cleanedReply = reply
      .replace(/\n/g, "")
      .split(" ")
      .filter((word) => !stopWords.includes(word.toLowerCase()))
      .join(" ")
      .toLowerCase();

    this.parsedContext.content =
      this.parsedContext.content + " " + cleanedReply;
    fs.writeFileSync(
      this.JSON_FILE,
      JSON.stringify(this.parsedContext, null, 2)
    );
  }

  async initChat() {
    try {
      const response = await this.openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: scripts.initialPrompt,
          },
        ],
        max_tokens: 100,
      });

      const replyObject = response.data.choices[0].message;
      this.addMemory(replyObject);
      console.log("Memory Stored");
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async mainChat(prompt) {
    try {
      const response = await this.openai.createCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: scripts.conceptPrompt,
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 1000,
      });

      const replyObject = response.data;
      this.addMemory(replyObject);
      console.log("Memory Stored");
      return replyObject;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async startChat() {
    await this.initChat();
  }
}
