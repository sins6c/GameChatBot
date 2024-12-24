import React, { useState, useEffect } from 'react';
import Message from './Message';
import '../App.css';

const BEYOND_API_URL = 'https://dev.beyondnetwork.xyz/api/chat/completions';
const API_KEY = "f8c3de3d-1234-4321-a7b8-5c1e9f2d3b4a";

function Chatbot() {
  const [messages, setMessages] = useState([
    { text: 'Hey, welcome to BulliverseBot! How can I assist you today?', sender: 'bot' },
  ]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Focus on input when hitting enter
  useEffect(() => {
    const handleEnterKey = (event) => {
      if (event.key === 'Enter' && !loading) {
        document.getElementById('sendButton').click();
      }
    };

    document.addEventListener('keydown', handleEnterKey);
    return () => {
      document.removeEventListener('keydown', handleEnterKey);
    };
  }, [loading]);

  // Sanitize the response to remove invalid characters
  const sanitizeResponse = (response) => {
    return response.replace(/[^\x20-\x7E\n\r]/g, ''); // Remove non-ASCII characters
  };

  const fetchBotResponse = async (userMessage) => {
    try {
      setLoading(true);
      const response = await fetch(BEYOND_API_URL, {  
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
        },
        body: JSON.stringify({
          model: 'meta-llama/Meta-Llama-3-8B-Instruct-Turbo',
          messages: [
            {
              role: 'system',
              content:
                'You are a gaming expert assistant. Only answer gaming-related queries and always respond in English. If the query is unrelated to gaming, politely explain that you can only assist with gaming topics.',
            },
            {
              role: 'user',
              content: userMessage,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch response from Beyond API');
      }

      const data = await response.json();
      if (!data || !data.choices || data.choices.length === 0) {
        return "I'm sorry, I couldn't find the gaming information you're looking for.";
      }

      const botMessage =
        sanitizeResponse(data.choices[0]?.message?.content) ||
        "Sorry, I couldn't process your request. Please try again.";
      return botMessage;
    } catch (error) {
      console.error('Error fetching bot response:', error);
      return 'Something went wrong. Please try again later.';
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (userInput.trim()) {
      const userMessage = userInput.trim();

      setMessages((prevMessages) => [
        ...prevMessages,
        { text: userMessage, sender: 'user' },
      ]);

      const sendButton = document.getElementById('sendButton');
      sendButton.classList.add('active');
      setTimeout(() => {
        sendButton.classList.remove('active');
      }, 200);

      const botResponse = await fetchBotResponse(userMessage);

      setMessages((prevMessages) => [
        ...prevMessages,
        { text: botResponse, sender: 'bot' },
      ]);

      setUserInput('');
    }
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, index) => (
          <Message key={index} text={msg.text} sender={msg.sender} />
        ))}
        {loading && <div className="loading">Thinking...</div>}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button
          id="sendButton"
          onClick={handleSendMessage}
          disabled={loading}
          style={{ transition: 'all 0.2s ease-in-out' }}
        >
          {loading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
}

export default Chatbot;
