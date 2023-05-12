import("./test.cjs").then((keywordExtractor) => {
  const userInput = "I want to go to tokyo";
  const keywords = keywordExtractor.extractKeywords(userInput);
  console.log(keywords);
});
