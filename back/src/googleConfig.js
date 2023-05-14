import * as dotenv from "dotenv";

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
        console.log(data);
        var items = data.items;
        items.forEach((item) => {
          console.log(item.link);
        });
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  }
}

const target = {
  depart: "230513",
  arrivePort: "NRT",
  arrivedCountry: "tokyo",
  departPort: "ICN",
  departedCountry: "seoul",
  arrive: "230515",
  duration: 3,
};

// console.log(`${target["arrivedCountry"]}`);

const gcse = new GoogleConfiguration();

gcse.fetchQueryResults(
  `${target["arrivedCountry"]} ${target["duration"]} day trip itenary`
);
