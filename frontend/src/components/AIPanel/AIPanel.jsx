import React, { useState } from 'react';
import './AIPanel.css';

function AIPanel() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const newMessage = {
        id: Date.now(),
        text: inputMessage,
        sender: 'user'
      };
      setMessages([...messages, newMessage]);
      setInputMessage('');

      // Simulate AI response (placeholder)
      setTimeout(() => {
        const aiResponse = {
          id: Date.now() + 1,
          text: `I received: "${inputMessage}"`,
          sender: 'ai'
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 500);
    }
  };

  return (
    <div className="ai-panel">
      <div className="ai-panel-header">
        <h3>AI Assistant</h3>
      </div>
      <div className="ai-messages-container">
        {messages.map(message => (
          <div 
            key={message.id} 
            className={`ai-message ${message.sender}`}
          >
            {message.text}
          </div>
        ))}
      </div>
      <div className="ai-input-container">
        <input 
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Ask the AI..."
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}

export default AIPanel;
