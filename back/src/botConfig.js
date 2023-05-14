import * as dotenv from "dotenv";
import { identityPrompt, stopWords } from "../common/prompts.js";
import { Configuration, OpenAIApi } from "openai";

import NlpConfiguration from "./nlpConfig.js";
import { cleanMemory, cleanReply, logMemory } from "../common/clean.js";

dotenv.config();

export default class BotConfiguration {
  constructor() {
    this.configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.openai = new OpenAIApi(this.configuration);
    this.nlp = new NlpConfiguration();
    this.model = "gpt-3.5-turbo";
  }

  async chat(prompt, memory) {
    try {
      const cleanMemory = cleanMemory(memory);
      const cleanedMemoryLog = logMemory(cleanMemory);
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
