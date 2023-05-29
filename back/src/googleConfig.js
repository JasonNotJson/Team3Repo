import * as dotenv from "dotenv";
import NlpConfiguration from "./nlpConfig.js";

dotenv.config();

export default class GoogleConfiguration {
  constructor() {
    this.apiKey = process.env.GOOGLE_API_KEY;
    this.cx = process.env.GOOGLE_CX;
    this.apiUrl = "https://www.googleapis.com/customsearch/v1";
  }

  async fetchQueryResults(searchQuery) {
    const searchUrl = `${this.apiUrl}?key=${this.apiKey}&cx=${
      this.cx
    }&q=${encodeURIComponent(searchQuery)}`;

    try {
      const response = await fetch(searchUrl);
      const data = await response.json();
      // console.log(data.items);
      const items = data.items;
      let resultObj = { results: [] };
      items.forEach((item) => {
        resultObj.results.push({
          title: item.title,
          link: item.link,
        });
      });
      const jsonResultObj = JSON.stringify(resultObj);
      // console.log(jsonResultObj);
      return jsonResultObj;
    } catch (error) {
      console.log("Error:", error);
    }
  }

  buildSearchQuery(memory) {
    const searchQuery = `${memory["arrivedCountry"]} ${memory["duration"]} day trip itinerary`;
    return searchQuery;
  }

  checkProp(processedMemory) {
    const requiredProps = [
      "depart",
      "arrivePort",
      "arrivedCountry",
      "departPort",
      "departedCountry",
      "arrive",
      "duration",
    ];
    const checkedProps = requiredProps.every(
      (prop) =>
        processedMemory.hasOwnProperty(prop) &&
        processedMemory[prop] !== null &&
        processedMemory[prop] !== undefined
    );
    return checkedProps;
  }

  async searchWords(memory) {
    const results = new NlpConfiguration(memory).processDateLoc();
    console.log(results);
    // const results = {
    //   depart: "230517",
    //   arrivePort: "NRT",
    //   arrivedCountry: "tokyo",
    //   departPort: "ICN",
    //   departedCountry: "seoul",
    //   arrive: "230520",
    //   duration: 4,
    // };
    const isChecked = this.checkProp(results);

    if (isChecked) {
      const searchQuery = this.buildSearchQuery(results);
      const jsonResultObj = await this.fetchQueryResults(searchQuery);
      const data = JSON.stringify({ status: "Complete", links: jsonResultObj });
      console.log(jsonResultObj);
      return data;
    } else {
      console.log("Incomplete");
      return JSON.stringify({ status: "Incomplete" });
    }
  }
}

// console.log(`${target["arrivedCountry"]}`);
// const memory = `want tokyo bot: assistant: great choice! please provide dates plan tokyo? user: planning tokyo may 13th may 15th bot: bot: thanks providing dates. please tell departing from? user: departing seoul bot: bot: thank letting know. tell stay tokyo? user: stay shinjuku bot: one question, booked accommodation shinjuku suggest options? user: suggest options bot: bot: sure! accommodation options shinjuku: 1. shinjuku granbell hotel 2. hyatt regency tokyo  3. keio plaza hotel tokyo  4. hilton tokyo  5. hotel sunroute plaza shinjuku  options picked accommodation. user: suggest cheaper options bot: bot: sure, budget-friendly accommodation options shinjuku: 1. shin okubo sekitei 2. shinjuku kuyakushomae capsule hotel 3. business hotel yamashiro 4. hotel wing international premium tokyo yotsuya 5. hotel gracery shinjuku (sometimes deals discounts). preferences want book options you. user: give schedule`;
// const gcse = new GoogleConfiguration(memory);
// const keyWords = await gcse.searchWords();
// console.log(keyWords);
// console.log("This is the key words" + keyWords);

//booking.com
//https://www.booking.com/searchresults.ja.html?ss=tokyo&ssne=tokyo&ssne_untouched==tokyo&dest_type=city&checkin=2023-05-15&checkout=2023-05-20&group_adults=2&no_rooms=1

//skyscanner
//https://www.skyscanner.net/transport/flights/nrt/icn/230515/230518/?adultsv2=1&cabinclass=economy&childrenv2=&inboundaltsenabled=false&is_banana_refferal=true&outboundaltsenabled=false&preferdirects=false&qp_prevScreen=HOMEPAGE&ref=home&rtn=1
