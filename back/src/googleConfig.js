import * as dotenv from "dotenv";
import NlpConfiguration from "./nlpConfig.js";

dotenv.config();

export default class GoogleConfiguration {
  constructor() {
    this.apiKey = process.env.GOOGLE_API_KEY;
    this.cx = process.env.GOOGLE_CX;
    this.apiUrl = "https://www.googleapis.com/customsearch/v1";
  }

  fetchQueryResults(searchQuery) {
    const searchUrl = `${this.apiUrl}?key=${this.apiKey}&cx=${
      this.cx
    }&q=${encodeURIComponent(searchQuery)}`;

    fetch(searchUrl)
      .then((response) => response.json())
      .then((data) => {
        console.log(data.items);
        var items = data.items;
        items.forEach((item) => {
          console.log(item.link);
        });
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  }

  searchWords(memory) {
    const results = new NlpConfiguration(memory).processDateLoc();
    return results;
  }
}

// console.log(`${target["arrivedCountry"]}`);
// const memory = `want tokyo bot: assistant: great choice! please provide dates plan tokyo? user: planning tokyo may 13th may 15th bot: bot: thanks providing dates. please tell departing from? user: departing seoul bot: bot: thank letting know. tell stay tokyo? user: stay shinjuku bot: one question, booked accommodation shinjuku suggest options? user: suggest options bot: bot: sure! accommodation options shinjuku: 1. shinjuku granbell hotel 2. hyatt regency tokyo  3. keio plaza hotel tokyo  4. hilton tokyo  5. hotel sunroute plaza shinjuku  options picked accommodation. user: suggest cheaper options bot: bot: sure, budget-friendly accommodation options shinjuku: 1. shin okubo sekitei 2. shinjuku kuyakushomae capsule hotel 3. business hotel yamashiro 4. hotel wing international premium tokyo yotsuya 5. hotel gracery shinjuku (sometimes deals discounts). preferences want book options you. user: give schedule`;
// const gcse = new GoogleConfiguration(memory);
// const keyWords = gcse.searchWords;

// gcse.fetchQueryResults(
//   `${keyWords["arrivedCountry"]} ${keyWords["duration"]} day trip itenary`
// );

//booking.com
//https://www.booking.com/searchresults.ja.html?ss=tokyo&ssne=tokyo&ssne_untouched==tokyo&dest_type=city&checkin=2023-05-15&checkout=2023-05-20&group_adults=2&no_rooms=1

//skyscanner
//https://www.skyscanner.net/transport/flights/nrt/icn/230515/230518/?adultsv2=1&cabinclass=economy&childrenv2=&inboundaltsenabled=false&is_banana_refferal=true&outboundaltsenabled=false&preferdirects=false&qp_prevScreen=HOMEPAGE&ref=home&rtn=1
