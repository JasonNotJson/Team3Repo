import nlp from "compromise/three";
import plg from "compromise-dates";
import { parse, format } from "date-fns";
nlp.plugin(plg);

const memory = `want tokyo bot: assistant: great choice! please provide dates plan tokyo? user: planning tokyo may 13th to may 15th bot: bot: thanks providing dates. please tell departing from? user: departing seoul bot: bot: thank letting know. tell stay tokyo? user: stay shinjuku bot: one question, booked accommodation shinjuku suggest options? user: suggest options bot: bot: sure! accommodation options shinjuku: 1. shinjuku granbell hotel 2. hyatt regency tokyo  3. keio plaza hotel tokyo  4. hilton tokyo  5. hotel sunroute plaza shinjuku  options picked accommodation. user: suggest cheaper options bot: bot: sure, budget-friendly accommodation options shinjuku: 1. shin okubo sekitei 2. shinjuku kuyakushomae capsule hotel 3. business hotel yamashiro 4. hotel wing international premium tokyo yotsuya 5. hotel gracery shinjuku (sometimes deals discounts). preferences want book options you. user: give schedule`;

const rawDates = nlp(memory).dates().format("{month} {date-ordinal}").text();

const dateStrings = rawDates.split(" to ");

// Parse and format the dates
const dates = dateStrings.map((dateString) => {
  const date = parse(dateString, "MMMM do", new Date());
  return format(date, "yyMMdd");
});

console.log(dates);

const places = nlp(memory).places().out("array");
// console.log(places);

import("./TfIdf.cjs").then((keywordExtractor) => {
  const userInput = places;
  const keywords = keywordExtractor.extractKeywords(userInput);
  console.log(keywords);
});

console.log(keywords);
