import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { API_ENDPOINTS } from '../../config/api';
import './ChatBot.css';

interface Message {
  text: string;
  isBot: boolean;
  timestamp?: Date;
}

interface UserData {
  name: string;
  mobile: string;
  email: string;
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [step, setStep] = useState(0); // 0: greeting, 1: ask name, 2: ask mobile, 3: ask email, 4: complete
  const [userData, setUserData] = useState<UserData>({ name: '', mobile: '', email: '' });
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const addMessage = (text: string, isBot: boolean) => {
    const newMessage = { text, isBot, timestamp: new Date() };
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  };

  const saveConversation = async () => {
    try {
      await fetch(API_ENDPOINTS.CHAT_NUMBERS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          name: userData.name,
          mobile: userData.mobile,
          email: userData.email,
          messages,
          status: step === 4 ? 'completed' : 'active'
        })
      });
    } catch (error) {
      console.error('Error saving conversation:', error);
    }
  };

  useEffect(() => {
    const userMessages = messages.filter(msg => !msg.isBot);
    if (userMessages.length > 0) {
      saveConversation();
    }
  }, [messages, userData, step]);

  const handleToggle = () => {
    if (isOpen) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
      if (messages.length === 0) {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          addMessage('Hello! I\'m Sarah from Alachtsasia Manpower. How can I help you today?', true);
          setStep(0);
        }, 1000);
      }
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    
    addMessage(input, false);
    const userInput = input.trim();
    setInput('');

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      if (step === 0) {
        addMessage('Thank you for reaching out! May I have your name please?', true);
        setStep(1);
      } else if (step === 1) {
        setUserData(prev => ({ ...prev, name: userInput }));
        addMessage(`Nice to meet you, ${userInput}! Could you please provide your mobile number?`, true);
        setStep(2);
      } else if (step === 2) {
        setUserData(prev => ({ ...prev, mobile: userInput }));
        addMessage('Great! May I also have your email address?', true);
        setStep(3);
      } else if (step === 3) {
        setUserData(prev => ({ ...prev, email: userInput }));
        addMessage('Perfect! Thank you for providing your details. Our team will contact you shortly to discuss your manpower requirements. Have a great day!', true);
        setStep(4);
      }
    }, 1500);
  };

  return (
    <>
      <div className={`chat-toggle ${isOpen ? 'open' : ''}`} onClick={handleToggle}>
        <div className="chat-pulse"></div>
        <MessageCircle size={24} />
      </div>
      
      {isOpen && (
        <div className="chat-container">
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="chat-avatar">S</div>
              <div>
                <span className="chat-title">Alachtsasia Support</span>
                <span className="chat-status">Online</span>
              </div>
            </div>
            <button className="chat-close" onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>
          
          <div className="chat-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.isBot ? 'bot' : 'user'}`}>
                <div className="message-content">
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="message bot typing">
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {step < 4 && (
            <div className="chat-input">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your message..."
              />
              <button 
                className="chat-send" 
                onClick={handleSend} 
                disabled={!input.trim()}
              >
                <Send size={18} />
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ChatBot;