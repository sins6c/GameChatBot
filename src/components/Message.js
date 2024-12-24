import React from 'react';
import '../App.css';

function Message({ text, sender }) {
    return (
        <div className={`message ${sender === 'user' ? 'user-message' : 'chatbot-message'}`}>
            {text}
        </div>
    );
}

export default Message;
