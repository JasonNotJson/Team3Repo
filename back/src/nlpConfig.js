import nlp from "compromise/three";
import datePlugin from "compromise-dates";
import nlpStats from "compromise-stats";
import { parse, format } from "date-fns";
import { cityAirport } from "../common/prompts.js";
nlp.plugin(datePlugin);
nlp.plugin(nlpStats);

export default class NlpConfiguration {
  constructor(memory) {
    this.memory = memory;
    this.cityAirport = cityAirport;
    this.doc = nlp(this.memory);
  }

  getDates() {
    const rawDates = this.doc
      .dates()
      .format("{month} {date-ordinal}")
      .out("array");
    return rawDates.map((rawDates) => {
      const date = parse(rawDates, "MMMM do", new Date());
      return format(date, "yyMMdd");
    });
  }

  getTfidfPlaces() {
    const rawPlaces = this.doc.places().out("text");
    const processedPlaces = nlp(rawPlaces);
    return processedPlaces.tfidf();
  }

  getAirports() {
    const tfidfPlaces = this.getTfidfPlaces();
    console.log(tfidfPlaces[0][0]);
    return tfidfPlaces.reduce((acc, [city, _], index) => {
      let keyPort = index === 0 ? "arrivePort" : "departPort";
      let keyCountry = index === 0 ? "arrivedCountry" : "departedCountry";
      return { ...acc, [keyPort]: this.cityAirport[city], [keyCountry]: city };
    }, {});
  }

  processDateLoc() {
    const dates = this.getDates();
    const queryAirports = this.getAirports();
    return {
      depart: dates[0],
      ...queryAirports,
      arrive: dates[1],
      duration: dates[1] - dates[0] + 1,
    };
  }
}
const memory = `want tokyo bot: assistant: great choice! please provide dates plan tokyo? user: planning tokyo may 13th may 15th bot: bot: thanks providing dates. please tell departing from? user: departing seoul bot: bot: thank letting know. tell stay tokyo? user: stay shinjuku bot: one question, booked accommodation shinjuku suggest options? user: suggest options bot: bot: sure! accommodation options shinjuku: 1. shinjuku granbell hotel 2. hyatt regency tokyo  3. keio plaza hotel tokyo  4. hilton tokyo  5. hotel sunroute plaza shinjuku  options picked accommodation. user: suggest cheaper options bot: bot: sure, budget-friendly accommodation options shinjuku: 1. shin okubo sekitei 2. shinjuku kuyakushomae capsule hotel 3. business hotel yamashiro 4. hotel wing international premium tokyo yotsuya 5. hotel gracery shinjuku (sometimes deals discounts). preferences want book options you. user: give schedule`;
const natLang = new NlpConfiguration(memory);
const result = natLang.processDateLoc();
console.log(result);
