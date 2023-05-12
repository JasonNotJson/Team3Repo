import { Configuration, OpenAIApi } from "openai";
import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
dotenv.config();

const configuration = new Configuration({
  organization: "org-c9Vywf0vZjLzpctWxULTvrRy",
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const response = await openai.listEngines();
