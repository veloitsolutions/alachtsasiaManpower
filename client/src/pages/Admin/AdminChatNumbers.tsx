import React, { useState, useEffect } from 'react';
import AdminSidebar from './components/AdminSidebar';
import { API_ENDPOINTS } from '../../config/api';
import { Loader2, MessageCircle, Trash2, X, User, Mail, Phone, Calendar } from 'lucide-react';

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
      
      if (!response.ok) throw new Error('Failed to fetch conversations');
      
      const data = await response.json();
      setConversations(Array.isArray(data) ? data : []);
    } catch (error) {
      setError('Failed to load conversations');
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this conversation?')) return;

    try {
      const response = await fetch(`${API_ENDPOINTS.CHAT_NUMBERS}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to delete conversation');

      fetchConversations();
      setSelectedConversation(null);
    } catch (error) {
      setError('Failed to delete');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 p-4 lg:p-8 lg:ml-0 overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-neutral-black mb-2">Chat Conversations</h1>
            <p className="text-neutral-gray">View and manage chat conversations</p>
          </div>

          {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">{error}</div>}

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
          ) : conversations.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl shadow-md">
              <MessageCircle className="w-16 h-16 text-neutral-gray mx-auto mb-4" />
              <p className="text-neutral-gray text-lg">No conversations found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {conversations.map((conversation) => (
                <div 
                  key={conversation._id} 
                  onClick={() => setSelectedConversation(conversation)}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6 border border-gray-100 cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-neutral-black">{conversation.name || 'Anonymous'}</h3>
                        <p className="text-xs text-neutral-gray">{new Date(conversation.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-neutral-gray">
                      <Phone size={14} />
                      <span>{conversation.mobile}</span>
                    </div>
                    <div className="flex items-center gap-2 text-neutral-gray">
                      <Mail size={14} />
                      <span className="truncate">{conversation.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-neutral-gray">
                      <MessageCircle size={14} />
                      <span>{conversation.messages.length} messages</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedConversation && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-neutral-black">Chat Details</h2>
                  <button
                    onClick={() => setSelectedConversation(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X size={24} className="text-neutral-gray" />
                  </button>
                </div>
                
                <div className="p-6 space-y-6">
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-neutral-gray" />
                      <div>
                        <p className="text-xs text-neutral-gray">Name</p>
                        <p className="font-medium text-neutral-black">{selectedConversation.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-neutral-gray" />
                      <div>
                        <p className="text-xs text-neutral-gray">Phone</p>
                        <p className="font-medium text-neutral-black">{selectedConversation.mobile}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-neutral-gray" />
                      <div>
                        <p className="text-xs text-neutral-gray">Email</p>
                        <p className="font-medium text-neutral-black">{selectedConversation.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-neutral-gray" />
                      <div>
                        <p className="text-xs text-neutral-gray">Date</p>
                        <p className="font-medium text-neutral-black">{new Date(selectedConversation.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-neutral-black mb-4">Messages</h4>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {selectedConversation.messages.map((message, index) => (
                        <div key={index} className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}>
                          <div className={`max-w-[70%] rounded-lg p-3 ${
                            message.isBot 
                              ? 'bg-gray-100 text-neutral-black' 
                              : 'bg-primary text-white'
                          }`}>
                            <p className="text-sm">{message.text}</p>
                            <p className={`text-xs mt-1 ${message.isBot ? 'text-neutral-gray' : 'text-white/70'}`}>
                              {new Date(message.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4">
                  <button
                    onClick={() => handleDelete(selectedConversation._id)}
                    className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-lg transition-all font-medium"
                  >
                    <Trash2 size={18} />
                    Delete Conversation
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminChatNumbers;
