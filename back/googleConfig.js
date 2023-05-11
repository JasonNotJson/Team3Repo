import * as dotenv from "dotenv";
import { response } from "express";

dotenv.config();

export class GoogleConfiguration {
  constructor() {
    this.apiKey = process.env.GOOGLE_API_KEY;
    this.cx = process.env.GOOGLE_CX;
    this.apiUrl = "https://www.googleapis.com/customsearch/v1";
    this.searchUrl = `${apiUrl}?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(
      searchQuery
    )}`;
  }
  fetch(searchUrl)
    .then((response) => response.json())
}

// Make the request
fetch(searchUrl)
  .then((response) => response.json())
  .then((data) => {
    // Process the JSON response
    console.log(data);
    // Extract and display the search results
    var items = data.items;
    items.forEach((item) => {
      // console.log(item.title);
      console.log(item.link);
    });
  })
  .catch((error) => {
    console.log("Error:", error);
  });
