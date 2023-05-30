import bot from "../assets/bot.svg";
import user from "../assets/user.svg";

const form = document.querySelector("form");
const chatContainer = document.querySelector("#chat_container");

let loadInterval;

async function loadChatData() {
  try {
    const response = await fetch("http://localhost:3000/chat"); // Adjust the URL as needed
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    for (let message of data) {
      const isAi = message.role === "bot";
      const uniqueId = generateUniqueId();
      chatContainer.innerHTML += chatStripe(isAi, message.message, uniqueId);
    }

    chatContainer.scrollTop = chatContainer.scrollHeight;
  } catch (error) {
    console.error("Error while fetching chat data:", error);
  }
}

loadChatData();

function loader(element) {
  element.textContent = "";

  loadInterval = setInterval(() => {
    element.textContent += ".";

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

  chatContainer.innerHTML += chatStripe(false, data.get("prompt"));

  form.reset();

  const uniqueId = generateUniqueId();
  chatContainer.innerHTML += chatStripe(true, " ", uniqueId);

  chatContainer.scrollTop = chatContainer.scrollHeight;

  const messageDiv = document.getElementById(uniqueId);

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

  console.log(response);

  clearInterval(loadInterval);
  messageDiv.innerHTML = " ";

  if (response.ok) {
    const data = await response.json();
    console.log({ data });
    const parsedData = data.trim();

    console.log({ parsedData });

    typeText(messageDiv, parsedData);

    const chatId = 1;
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

function checkAndDisplayButton() {
  const chatDataString = localStorage.getItem("chatData");

  const chatData = JSON.parse(chatDataString);

  const status = chatData.status;

  const showLinksButton = document.getElementById("showLinksButton");

  if (status === "Complete") {
    showLinksButton.style.display = "block";
  } else {
    showLinksButton.style.display = "none";
  }
}

document
  .getElementById("showLinksButton")
  .addEventListener("click", function () {
    console.log("Button was clicked");
    displayLinks();
  });

function displayLinks() {
  const chatDataString = localStorage.getItem("chatData");

  const chatData = JSON.parse(chatDataString);

  const linksString = chatData.links;

  const links = JSON.parse(linksString);

  let allLinks = "Here are the reference links!\n\n";

  links.results.forEach((link, index) => {
    allLinks += `${index + 1}. [${link.title}](${link.link})\n`;
  });

  const uniqueId = generateUniqueId();

  const chatStripeHTML = chatStripe(true, allLinks, uniqueId);

  chatContainer.innerHTML += chatStripeHTML;
}
