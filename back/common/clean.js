import { removeStopwords } from "stopword";
import { stopWords } from "../common/prompts.js";

export const cleanMemory = (memory) => {
  const processedMemory = memory
    .map((log) => `${log.role}: ${log.message}`)
    .join(" ");

  const replyArray = processedMemory
    .toLowerCase()
    .replace(/\n/g, " ")
    .split(" ")
    .filter((word) => !stopWords.includes(word.toLowerCase()));
  const processedReply = removeStopwords(replyArray).join(" ");

  return processedReply;

  // console.log("We are in function clean Memory", memory);
};
