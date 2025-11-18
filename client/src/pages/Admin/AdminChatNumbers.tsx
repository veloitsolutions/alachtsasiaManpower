import React, { useState, useEffect } from 'react';
import AdminSidebar from './components/AdminSidebar';
import { API_ENDPOINTS } from '../../config/api';
import './AdminStyles.css';

interface Message {
  text: string;
  isBot: boolean;
  timestamp: string;
}

interface Conversation {
  _id: string;
  sessionId: string;
  name: string;
  mobile: string;
  email: string;
  messages: Message[];
  status: string;
  createdAt: string;
}

const AdminChatNumbers: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

  const userInfoString = localStorage.getItem('userInfo');
  const userInfo = userInfoString ? JSON.parse(userInfoString) : null;
  const token = userInfo?.token;

  useEffect(() => {
    fetchConversations();
  }, [token]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.CHAT_NUMBERS, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch conversations');
      }
      
      const data = await response.json();
      setConversations(Array.isArray(data) ? data : []);
    } catch (error) {
      setError('Failed to load conversations');
      console.error('Error fetching conversations:', error);
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this conversation?')) {
      return;
    }

    try {
      const response = await fetch(`${API_ENDPOINTS.CHAT_NUMBERS}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error('Failed to delete conversation');
      }

      fetchConversations();
      setSelectedConversation(null);
    } catch (error) {
      setError('Failed to delete');
      console.error(error);
    }
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <div className="admin-content">
        <div className="admin-header">
          <h1>Chat Numbers</h1>
        </div>

        {error && <div className="admin-error-message">{error}</div>}

        {loading ? (
          <div className="admin-loading">Loading...</div>
        ) : conversations.length === 0 ? (
          <div className="admin-empty-state">
            <p>No conversations found</p>
          </div>
        ) : (
          <div className="conversations-grid">
            {conversations.map((conversation) => (
              <div 
                key={conversation._id} 
                className="conversation-card"
                onClick={() => setSelectedConversation(conversation)}
              >
                <div className="conversation-card-header">
                  <strong>{conversation.name || 'Anonymous'}</strong>
                </div>
                <div className="conversation-card-details">
                  <p>Phone: {conversation.mobile}</p>
                  <p>Email: {conversation.email}</p>
                  <p>Date: {new Date(conversation.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedConversation && (
          <div className="admin-modal">
            <div className="admin-modal-content">
              <div className="admin-modal-header">
                <h2>Chat Details</h2>
                <button 
                  onClick={() => setSelectedConversation(null)}
                  className="admin-modal-close"
                >
                  ×
                </button>
              </div>
              
              <div className="admin-modal-body">
                <div className="user-info">
                  <p><strong>Name:</strong> {selectedConversation.name}</p>
                  <p><strong>Phone:</strong> {selectedConversation.mobile}</p>
                  <p><strong>Email:</strong> {selectedConversation.email}</p>
                  <p><strong>Date:</strong> {new Date(selectedConversation.createdAt).toLocaleString()}</p>
                </div>

                <h4>Messages</h4>
                <div className="messages">
                  {selectedConversation.messages.map((message, index) => {
                    const displayText = message.text;
                    return (
                      <div key={index} className={`message ${message.isBot ? 'bot' : 'user'}`}>
                        <div className="message-content">{displayText}</div>
                        <div className="message-time">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="admin-modal-footer">
                <button 
                  onClick={() => handleDelete(selectedConversation._id)}
                  className="admin-delete-button"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminChatNumbers;