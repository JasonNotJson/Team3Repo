import * as dotenv from "dotenv";
import { identityPrompt, stopWords } from "../common/prompts.js";
import { Configuration, OpenAIApi } from "openai";
import { removeStopwords } from "stopword";

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
    const replyArray = reply
      .toLowerCase()
      .replace(/\n/g, " ")
      .split(" ")
      .filter((word) => !stopWords.includes(word.toLowerCase()));
    // reply
    //   .toLowerCase()
    //
    //   .split(" ")
    //
    //   .join(" ");

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

// const testInstance = new BotConfiguration();
// testInstance.initChat();
// testInstance.chat("I want to go to a 3 day tokyo trip");
// testInstance.chat("I want to go to Tokyo from May 13 to May 15");
// testInstance.chat("What location is a good place to stay in Tokyo?");
// console.log(testInstance.context);
//
