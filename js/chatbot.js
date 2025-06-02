//script to handle the chatbot in all .html pages (except the Quiz.html)

//#chatbot bubble :
//handle hide or show the chatbot when we click on the chatbot bubble
var nbClick = 0;
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('chatbotbubble').addEventListener("click", () => {
        var elts = document.getElementById('chatbot').children;
        if (nbClick % 2 == 0) {
            //show the chatbot
            document.getElementById('chatbot').style.pointerEvents = 'all';
            for (let i = 0; i < elts.length - 1; i++) {
                elts[i].style.display = "block";
            };
            document.getElementById('chatbot').style.backgroundColor = 'rgb(235, 230, 235)';
        }
        else {
            //hide the chatbot
            document.getElementById('chatbot').style.pointerEvents = 'none';
            for (let i = 0; i < elts.length - 1; i++) {
                elts[i].style.display = "none";
            };
            document.getElementById('chatbot').style.backgroundColor = '#00000000';
        }
        nbClick = ++nbClick % 2;
    });
});

//#chatbot founctions :
//handle the chatbot ; so the messages display, the input user, the bot response, the messages history.

//functions to handle the chat/messages history :

class ChatHistory {
    constructor() {
        this.messages = [];
    }
    addMessage(message) {
        this.messages.push(message);
    }
    getHistory() {
        return this.messages;
    }
}

var historyMessages = new ChatHistory();

// create a browser session to store messages 
function saveMessages() {
    console.log('Saving chat history...');
    console.log(historyMessages.getHistory());
    sessionStorage.setItem('chatHistory',
        JSON.stringify(historyMessages.getHistory())); //.map(msg => msg.message)));
}

// Function to load messages from the browser session 
function loadMessages() {
    //past message text
    const chatArea = document.getElementById("chat-box");
    const messagePart = document.createElement('div');
    const hr = document.createElement('hr');
    messagePart.classList.add("date");
    messagePart.textContent = "past messages";
    chatArea.appendChild(messagePart);

    // Recover message history from browser session 
    const chatHistory = JSON.parse(sessionStorage.getItem('chatHistory'));
    if (chatHistory) {
        chatHistory.forEach(message => {
            showMessage(message.text, 'old-' + message.sender);
            historyMessages.addMessage(message); // to resave the past msg again
        });
    }

    chatArea.appendChild(hr);
}

//when we quit the pages, we store the messages
window.addEventListener("beforeunload", saveMessages);
//when we load the pages, we retrieve the past messages
window.addEventListener("DOMContentLoaded", loadMessages);


//functions to handle the messages display, the input user, the bot response :

//when pressing the send button, we call this function
// Function for retrieving and processing JSON 
function fetchJSON(url) {
    // Retrieve JSON from supplied URL 
    fetch(url)
        //then is a method that returns a promise and takes as a parameter a
        //callback function that will be executed once the promise has been resolved. 
        .then(response => {
            // Check if the answer is correct 
            if (!response.ok) {
                // If the answer is not correct, throw an error 
                throw new Error('Network response was not ok');
            }
            // If the answer is correct, return the JSON 
            return response.json();
        })
        //then here will retrieve the JSON returned by the promise 
        .then(data => {
            // Check if JSON is empty or malformed 
            if (Object.keys(data).length === 0 && data.constructor === Object) {
                // If the JSON is empty or badly formed, throw an error 
                throw new Error('Empty JSON or malformed JSON');
            }
            //The JSON is displayed in the console. This is an object containing the chatbot's
            // chatbot's intentions
            console.log(data);
            // Pass intentions to the sendMessage function to be defined later 
            sendMessage(data.intents);
        })
        //catch is a method that returns a promise and takes as parameter a 
        //callback function that will be executed in the event of an error 
        .catch(error => {
            // In the event of an error, display an error message in the console 
            console.error('There was a problem with the fetch operation:', error);
        });
}

//function handeling, by calling other fct, the user message & bot response
function sendMessage(intents) {
    //Retrieve user input in a variable
    const userInput = document.getElementById("user-input");

    if (userInput.value) { // to don't send an empty message
        //Display date
        const now = new Date();
        console.log(now);
        const chatArea = document.getElementById("chat-box");
        const messagePart = document.createElement('div');
        messagePart.classList.add("date");
        messagePart.textContent = now.toLocaleString();
        chatArea.appendChild(messagePart);

        //Display user message in chat box
        showMessage(userInput.value, 'user');

        //Processing the user's message and obtaining the chatbot's response
        const botResponse = processMessage(intents, userInput.value);

        //Displaying the chatbot's response in the chat box 
        showMessage(botResponse, 'bot');

        //history of messages
        const msg1 = { text: userInput.value, sender: 'user' };
        const msg2 = { text: botResponse, sender: 'bot' };
        historyMessages.addMessage(msg1);
        historyMessages.addMessage(msg2);

        //Finally, delete the input field
        userInput.value = "";
    }
}

//to display a message, by a user or bot, on the messages area (chat-box)
function showMessage(message, sender) {
    const chatArea = document.getElementById("chat-box");
    const messagePart = document.createElement('div');
    messagePart.classList.add(sender === 'user' ? 'user-message' : 'bot-message');
    if (sender.includes('old')) {
        messagePart.classList.add(sender === 'old-user' ? 'old-user-message' : 'old-bot-message');
    }
    messagePart.textContent = message;
    chatArea.appendChild(messagePart);
    chatArea.scrollTop = chatArea.scrollHeight;
}

// Function to process the user's message, and give the bot response
function processMessage(intents, message) {
    // By default, the response is "I'm sorry, I'm not sure I understand." 
    let response = "I'm sorry, I'm not sure I understand.";
    // Browse chatbot intentions 
    intents.forEach(intent => {
        // Check if the user's message matches one of the patterns 
        intent.patterns.forEach(pattern => {
            // Check if the user's message contains the pattern 
            if (message.toLowerCase().includes(pattern.toLowerCase())) {
                // Select a random answer from the list 
                response = intent.responses[Math.floor(Math.random() *
                    intent.responses.length)];
            }
        });
    });
    // Return answer
    return response;
}