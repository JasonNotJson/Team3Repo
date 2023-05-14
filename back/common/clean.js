import { removeStopwords } from "stopword";
import { stopWords } from "../common/prompts.js";

export const cleanMemory = (memory) => {
  const replyArray = memory
    .toLowerCase()
    .replace(/\n/g, " ")
    .split(" ")
    .filter((word) => !stopWords.includes(word.toLowerCase()));

  const processedReply = removeStopwords(replyArray).join(" ");

  return processedReply;
};

export const logMemory = (memory) => {
  const processedMemory = memory
    .map((log) => `${log.role}: ${log.message}`)
    .join(" ");
  return processedMemory;
};
