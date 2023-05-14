import * as dotenv from "dotenv";
import { identityPrompt, stopWords } from "../common/prompts.js";
import { Configuration, OpenAIApi } from "openai";
import { removeStopwords } from "stopword";

dotenv.config();

export default class BotConfiguration {
  constructor() {
    this.configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.openai = new OpenAIApi(this.configuration);
    this.model = "gpt-3.5-turbo";
  }

  cleanReply(reply) {
    const replyArray = reply
      .toLowerCase()
      .replace(/\n/g, " ")
      .split(" ")
      .filter((word) => !stopWords.includes(word.toLowerCase()));

    const newString = removeStopwords(replyArray).join(" ");

    return newString;
  }

  async chat(prompt, memory) {
    try {
      const memoryLog = memory
        .map((log) => `${log.role}: ${log.message}`)
        .join(" ");
      const cleanedMemoryLog = this.cleanReply(memoryLog);
      const response = await this.openai.createChatCompletion({
        model: this.model,
        messages: [
          {
            role: "user",
            content: identityPrompt + cleanedMemoryLog + prompt,
          },
        ],
        max_tokens: 1000,
      });

      const replyObject = response.data.choices[0].message;
      const body = replyObject.content;

      console.log("Reply : ");
      console.log(replyObject);
      console.log("Memory : ");
      console.log(cleanedMemoryLog);
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
