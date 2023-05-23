import "../styles.css";
import javascriptLogo from "../public/javascript.svg";
import viteLogo from "../public/vite.svg";
import { setupCounter } from "./counter.js";

document.querySelector("#app").innerHTML = `
  
`;

setupCounter(document.querySelector("#counter"));
