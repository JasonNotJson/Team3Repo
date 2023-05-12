import("./TfIdf.cjs").then((keywordExtractor) => {
  const userInput = ``;
  const keywords = keywordExtractor.extractKeywords(userInput);
  console.log(keywords);
});
