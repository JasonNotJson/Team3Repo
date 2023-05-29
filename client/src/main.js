import bot from "../assets/bot.svg";
import user from "../assets/user.svg";

const form = document.querySelector("form");
const chatContainer = document.querySelector("#chat_container");

let loadInterval;

// The rest of your main.js file...

// Function to fetch chat data from the server and display it
async function loadChatData() {
  try {
    const response = await fetch("http://localhost:3000/chat"); // Adjust the URL as needed
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    // Loop through the data and create chat stripes
    for (let message of data) {
      const isAi = message.role === "bot"; // Check if the message is from the bot
      const uniqueId = generateUniqueId();
      chatContainer.innerHTML += chatStripe(isAi, message.message, uniqueId);
    }
    // Scroll to the bottom of the chat container
    chatContainer.scrollTop = chatContainer.scrollHeight;
  } catch (error) {
    console.error("Error while fetching chat data:", error);
  }
}

// Call the function when the script is loaded
loadChatData();

// The rest of your main.js file...

function loader(element) {
  element.textContent = "";

  loadInterval = setInterval(() => {
    // Update the text content of the loading indicator
    element.textContent += ".";

    // If the loading indicator has reached three dots, reset it
    if (element.textContent === "....") {
      element.textContent = "";
    }
  }, 300);
}

function typeText(element, text) {
  let index = 0;

  let interval = setInterval(() => {
    if (index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 20);
}

// generate unique ID for each message div of bot
// necessary for typing text effect for that specific reply
// without unique ID, typing text will work on every element
function generateUniqueId() {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe(isAi, value, uniqueId) {
  return `
        <div class="wrapper ${isAi && "ai"}">
            <div class="chat">
                <div class="profile">
                    <img 
                      src=${isAi ? bot : user} 
                      alt="${isAi ? "bot" : "user"}" 
                    />
                </div>
                <div class="message" id=${uniqueId}>${value}</div>
            </div>
        </div>
    `;
}

const handleSubmit = async (e) => {
  e.preventDefault();

  const data = new FormData(form);

  // user's chatstripe
  chatContainer.innerHTML += chatStripe(false, data.get("prompt"));

  // to clear the textarea input
  form.reset();

  // bot's chatstripe
  const uniqueId = generateUniqueId();
  chatContainer.innerHTML += chatStripe(true, " ", uniqueId);

  // to focus scroll to the bottom
  chatContainer.scrollTop = chatContainer.scrollHeight;

  // specific message div
  const messageDiv = document.getElementById(uniqueId);

  // messageDiv.innerHTML = "..."
  loader(messageDiv);

  const response = await fetch("http://localhost:3000/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chatId: 1,
      message: data.get("prompt"),
    }),
  });

  console.log(response); // add this line

  clearInterval(loadInterval);
  messageDiv.innerHTML = " ";

  if (response.ok) {
    const data = await response.json();
    console.log({ data });
    const parsedData = data.trim(); // trims any trailing spaces/'\n'

    console.log({ parsedData });

    typeText(messageDiv, parsedData);

    const chatId = 1; // Assume the chatId is 1, change this as needed.
    const url = `http://localhost:3000/chat/sse?chatId=${chatId}`;
    const eventSource = new EventSource(url);

    eventSource.onmessage = function (event) {
      const data = JSON.parse(event.data);
      // Unique ID for the bot message

      localStorage.setItem("chatData", JSON.stringify(data));
    };

    eventSource.onerror = function (err) {
      console.error("EventSource failed:", err);
    };
    checkAndDisplayButton();
  } else {
    const err = await response.text();

    messageDiv.innerHTML = "Something went wrong";
    alert(err);
  }
};

form.addEventListener("submit", handleSubmit);
form.addEventListener("keyup", (e) => {
  if (e.keyCode === 13) {
    handleSubmit(e);
  }
});

// Attach an event listener to the window
function checkAndDisplayButton() {
  // Fetch chatData from localStorage
  const chatDataString = localStorage.getItem("chatData");

  // Parse the string into a JSON object
  const chatData = JSON.parse(chatDataString);

  // Access the status property in the chatData object
  const status = chatData.status;

  // Find the button by its id
  const showLinksButton = document.getElementById("showLinksButton");

  // If the status is 'Complete', display the button
  if (status === "Complete") {
    showLinksButton.style.display = "block";
  } else {
    // Otherwise, hide the button
    showLinksButton.style.display = "none";
  }
}

// Make sure to call checkAndDisplayButton() function every time after user interaction

document
  .getElementById("showLinksButton")
  .addEventListener("click", function () {
    console.log("Button was clicked");
    displayLinks();
  });

function displayLinks() {
  // Fetch chatData from localStorage
  const chatDataString = localStorage.getItem("chatData");

  // Parse the string into a JSON object
  const chatData = JSON.parse(chatDataString);

  // Access the links property in the chatData object
  const linksString = chatData.links;

  // Parse linksString into a JSON object
  const links = JSON.parse(linksString);

  // Define an empty string to concatenate all the links
  let allLinks = "Here are the reference links!\n\n";

  // Loop through the array of link objects
  links.results.forEach((link, index) => {
    // Prepare the message content with title and URL, add a newline character for readability
    allLinks += `${index + 1}. [${link.title}](${link.link})\n`;
  });

  const uniqueId = generateUniqueId();

  // Generate chat stripe using the allLinks content
  const chatStripeHTML = chatStripe(true, allLinks, uniqueId);

  // Append the chat stripe to the chatContainer
  chatContainer.innerHTML += chatStripeHTML;
}
