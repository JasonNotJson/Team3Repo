import * as dotenv from "dotenv";
import * as fs from "fs";
import {
  initialPrompt,
  secretPrompt,
  summaryPrompt,
  continuePrompt,
  stopWords,
} from "../common/prompts.js";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();

export class BotConfiguration {
  constructor() {
    this.configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.openai = new OpenAIApi(this.configuration);
    this.model = "gpt-3.5-turbo";
  }

  cleanReply(reply) {
    return reply
      .replace(/\n/g, "")
      .split(" ")
      .filter((word) => !stopWords.includes(word.toLowerCase()))
      .join(" ")
      .toLowerCase();
  }

  async Chat(prompt) {
    try {
      const response = await this.openai.createChatCompletion({
        model: this.model,
        messages: [
          {
            role: "user",
            content: continuePrompt + prompt,
          },
        ],
        max_tokens: 1000,
      });

      const replyObject = response.data.choices[0].message;
      const body = replyObject.content;
      const markedPrompt = "'User prompt :" + prompt + "'";

      console.log("Reply : ");
      console.log(replyObject);
      return body;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // examine use for initial chat
  // async initChat() {
  //   try {
  //     const response = await this.openai.createChatCompletion({
  //       model: this.model,
  //       messages: [
  //         {
  //           role: "user",
  //           content: initialPrompt,
  //         },
  //       ],
  //       max_tokens: 100,
  //     });

  //     const replyObject = response.data.choices[0].message;
  //     const body = replyObject.content;
  //     console.log("Chat initiated Memory Stored");
  //     return body;
  //   } catch (error) {
  //     console.log(error);
  //     throw error;
  //   }
  // }
}

const testInstance = new BotConfiguration();
// testInstance.initChat();
// testInstance.Chat("I want to go to a 3 day tokyo trip");
// testInstance.Chat("I want to go to Tokyo from May 13 to May 15");
// testInstance.Chat("What location is a good place to stay in Tokyo?");
// console.log(testInstance.context);
//
