document.addEventListener("DOMContentLoaded", () => {
    const chatContainer = document.createElement('div');
    chatContainer.classList.add('chat-container');
    chatContainer.style.width = '100%'; // Adjust the width as desired
    chatContainer.style.height = '90%';

    const chatBox = document.createElement('div');
    chatBox.classList.add('chat-box');
    chatContainer.appendChild(chatBox);

    const inputContainer = document.createElement('div');
    inputContainer.classList.add('input-container');

    const inputField = document.createElement('input');
    inputField.setAttribute('type', 'text');
    inputField.setAttribute('placeholder', 'Type a message...');
    inputField.classList.add('input-field');
    inputContainer.appendChild(inputField);

    const sendButton = document.createElement('button');
    sendButton.innerText = 'Send';
    sendButton.classList.add('send-button');
    inputContainer.appendChild(sendButton);

    chatContainer.appendChild(inputContainer);
    document.body.appendChild(chatContainer);

    sendButton.addEventListener('click', () => {
        const userMessage = inputField.value.trim();
        if (userMessage) {
            appendMessage(userMessage, 'user');
            inputField.value = '';
            getChatbotResponse(userMessage);
        }
    });

    inputField.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            sendButton.click();
        }
    });

    function appendMessage(message, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender);
        messageElement.innerText = message;
        chatBox.appendChild(messageElement);
        // Correct the property name
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function getChatbotResponse(userMessage) {
        const body = {
            "dialogHistory": [userMessage]
        };

        fetch('https://api.rinna.co.jp/models/chitchat-generation', {
            method: 'POST',
            body: JSON.stringify(body),
            // Request headers
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
                'Ocp-Apim-Subscription-Key': 'fe69ad2a7d6e49c4967ec62c89cadc15',
            },
            mode: 'cors' // Set mode to 'cors' to allow CORS
        })
     .then(response => {
    // Log the response status
    console.log('Response status:', response.status);

    // Check if response is OK (status code 200)
    if (response.ok) {
        return response.json(); // Parse JSON response
    } else {
        // Log the error message
        console.error('Error message:', response.statusText);
        throw new Error('Network response was not ok');
    }
})

        .then(data => {
            const botResponse = data && data.results && data.results[0];
            if (botResponse) {
                appendMessage(botResponse, 'bot'); // Display bot response in chat
            } else {
                throw new Error('Invalid response from Rinna API');
            }
        })
        .catch(err => console.error(err));
    }
});
