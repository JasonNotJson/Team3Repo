import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import * as fs from "fs";
import { initialPrompt, stopWords } from "./scripts.js";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const JSON_FILE = "context.json";
const context = fs.readFileSync(JSON_FILE);
const parsedContext = JSON.parse(context);

const addMemory = (replyObject) => {
  const reply = replyObject.content;
  const cleanedReply = reply
    .replace(/\n/g, "")
    .split(" ")
    .filter((word) => !stopWords.includes(word.toLowerCase()))
    .join(" ")
    .toLowerCase();

  parsedContext.content = parsedContext.content + " " + cleanedReply;
  fs.writeFileSync(JSON_FILE, JSON.stringify(parsedContext, null, 2));
};

const initialChat = async () => {
  try {
    const response = await openai.createChatCompletion({
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
    addMemory(replyObject);
    console.log("Memory Stored");
  } catch (error) {
    console.log(error);
    throw error;
  }
};
