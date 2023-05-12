const natural = require("natural");
const TfIdf = natural.TfIdf;
const tfidf = new TfIdf();

function extractKeywords(text) {
  tfidf.addDocument(text);

  const items = [];
  tfidf.listTerms(0 /* in document index */).forEach(function (item) {
    items.push(item.term);
  });

  return items;
}

module.exports = { extractKeywords };

// const userInput = "from may 13 to 15";
// const keywords = extractKeywords(userInput);
// console.log(keywords);
