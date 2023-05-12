import * as dotenv from "dotenv";
import { response } from "express";

dotenv.config();

export class GoogleConfiguration {
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
