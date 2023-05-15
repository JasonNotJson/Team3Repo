export const identityPrompt = `You are a AI travel assistant named Travel Assistant. 
The following is the past record of the chat between me and you. 
Check the record if you have asked these questions: Dates, Departuring From. You are not allowed to book anyhing
IF you have not asked these answers, choose one of the questions not asked and ask me.
IF you have answered every question, create an itinerary for the given dates`;

export const regEx =
  /^(January|February|March|April|May|June|July|August|September|October|November|December)\s(\d{1,2}(st|nd|rd|th))$/i;

export const cityAirport = {
  tokyo: "NRT",
  "new york": "JFK",
  york: "JFK",
  "los angeles": "LAX",
  los: "LAX",
  angeles: "LAX",
  london: "LHR",
  paris: "CDG",
  dubai: "DXB",
  frankfurt: "FRA",
  sydney: "SYD",
  beijing: "PEK",
  bangkok: "BKK",
  seoul: "ICN",
  shanghai: "SHA",
  beijing: "PEK",
};

export const stopWords = [
  "travel",
  "assistant",
  "th",
  "great!",
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "by",
  "for",
  "from",
  "has",
  "he",
  "she",
  "in",
  "is",
  "it",
  "its",
  "of",
  "on",
  "that",
  "the",
  "was",
  "were",
  "will",
  "with",
  "famous",
  "iconic",
  "just",
  "Hi",
  "there",
  "'re",
  "'ll",
  "'s",
  "so",
  "easily",
  "any",
  "!",
  "?",
  "-",
  ":",
  "about",
  "above",
  "across",
  "after",
  "against",
  "ago",
  "all",
  "almost",
  "already",
  "also",
  "although",
  "always",
  "am",
  "among",
  "anymore",
  "anyone",
  "anything",
  "anyway",
  "anywhere",
  "apparently",
  "around",
  "as",
  "aside",
  "ask",
  "asking",
  "at",
  "away",
  "back",
  "badly",
  "be",
  "became",
  "because",
  "been",
  "before",
  "behind",
  "being",
  "below",
  "beside",
  "besides",
  "best",
  "better",
  "between",
  "beyond",
  "both",
  "briefly",
  "but",
  "by",
  "came",
  "can",
  "cannot",
  "can't",
  "caption",
  "cause",
  "certainly",
  "clearly",
  "come",
  "comes",
  "could",
  "couldn't",
  "dare",
  "dared",
  "dares",
  "daring",
  "definitely",
  "did",
  "didn't",
  "does",
  "doesn't",
  "doing",
  "done",
  "don't",
  "down",
  "downwards",
  "during",
  "each",
  "either",
  "else",
  "elsewhere",
  "enough",
  "even",
  "ever",
  "every",
  "everybody",
  "everyone",
  "everything",
  "everywhere",
  "exactly",
  "example",
  "except",
  "far",
  "few",
  "finally",
  "first",
  "following",
  "for",
  "forever",
  "former",
  "formerly",
  "forth",
  "forward",
  "found",
  "from",
  "further",
  "get",
  "gets",
  "getting",
  "given",
  "gives",
  "go",
  "goes",
  "going",
  "gone",
  "got",
  "gotten",
  "had",
  "hadn't",
  "has",
  "hasn't",
  "have",
  "haven't",
  "having",
  "he",
  "hello",
  "help",
  "hence",
  "her",
  "here",
  "hereafter",
  "hereby",
  "herein",
  "here's",
  "hereupon",
  "hers",
  "herself",
  "hi",
  "him",
  "himself",
  "his",
  "hither",
  "hopefully",
  "how",
  "however",
  "in",
  "indeed",
  "inner",
  "inside",
  "insofar",
  "instead",
  "into",
  "is",
  "isn't",
  "it",
  "its",
  "itself",
  "just",
  "keep",
  "keeps",
  "kept",
  "know",
  "known",
  "knows",
  "last",
  "lately",
  "later",
  "latter",
  "latterly",
  "least",
  "less",
  "lest",
  "let",
  "let's",
  "like",
  "liked",
  "likely",
  "likewise",
  "little",
  "look",
  "looking",
  "looks",
  "lot",
  "mainly",
  "many",
  "maybe",
  "me",
  "meanwhile",
  "might",
  "mine",
  "minus",
  "more",
  "moreover",
  "most",
  "mostly",
  "much",
  "must",
  "mustn't",
  "my",
  "myself",
  "name",
  "namely",
  "near",
  "need",
  "needed",
  "needing",
  "needs",
  "neither",
  "never",
  "nevertheless",
  "next",
  "nine",
  "no",
  "nobody",
  "none",
  "nor",
  "not",
  "nothing",
  "now",
  "nowhere",
  "obviously",
  "of",
  "off",
];
