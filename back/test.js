import puppeteer from "puppeteer";

const searchUrl = `https://www.booking.com/searchresults.ja.html?ss=tokyo&ssne=tokyo&ssne_untouched==tokyo&dest_type=city&checkin=2023-05-15&checkout=2023-05-20&group_adults=2&no_rooms=1`;

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(searchUrl);
  const content = await page.content();
})();
