import React, { useState, useEffect } from 'react';
import AdminSidebar from './components/AdminSidebar';
import { API_ENDPOINTS } from '../../config/api';
import { Loader2, Mail, Phone, Calendar, Eye, Trash2, X } from 'lucide-react';

interface Contact {
  _id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

const AdminContacts: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const userInfoString = localStorage.getItem('userInfo');
  const userInfo = userInfoString ? JSON.parse(userInfoString) : null;
  const token = userInfo?.token;

  useEffect(() => {
    fetchContacts();
  }, [token]);

  const fetchContacts = async () => {
    if (!token) {
      setError('No authentication token found');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.CONTACT, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch contacts');
      const data = await response.json();
      setContacts(data);
    } catch (error) {
      setError('Failed to fetch contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleViewContact = async (contact: Contact) => {
    setSelectedContact(contact);

    if (!contact.isRead) {
      try {
        const response = await fetch(`${API_ENDPOINTS.CONTACT}/${contact._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ isRead: true }),
        });

        if (response.ok) {
          setContacts(contacts.map(c =>
            c._id === contact._id ? { ...c, isRead: true } : c
          ));
        }
      } catch (error) {
        console.error('Failed to mark contact as read', error);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this contact submission?')) return;

    try {
      const response = await fetch(`${API_ENDPOINTS.CONTACT}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to delete contact');

      if (selectedContact && selectedContact._id === id) {
        setSelectedContact(null);
      }
      fetchContacts();
    } catch (error) {
      setError('Failed to delete contact');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 p-4 lg:p-8 lg:ml-0 overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 bg-primary rounded-2xl p-6 shadow-lg">
            <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold text-white mb-2">Contact Submissions</h1>
            <p className="text-white/90 text-sm sm:text-base">View and manage contact form submissions</p>
          </div>

          {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">{error}</div>}

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
          ) : contacts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl shadow-md">
              <Mail className="w-16 h-16 text-neutral-gray mx-auto mb-4" />
              <p className="text-neutral-gray text-lg">No contact submissions found.</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-gray uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-gray uppercase tracking-wider">Name</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-gray uppercase tracking-wider">Email</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-gray uppercase tracking-wider">Subject</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-gray uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-gray uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {contacts.map((contact) => (
                      <tr
                        key={contact._id}
                        className={`hover:bg-gray-50 transition-colors ${!contact.isRead ? 'bg-blue-50/50' : ''}`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${contact.isRead ? 'bg-gray-200 text-gray-700' : 'bg-green-100 text-green-700'}`}>
                            {contact.isRead ? 'Read' : 'Unread'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-neutral-black">{contact.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-neutral-gray">{contact.email}</td>
                        <td className="px-6 py-4 text-neutral-gray">{contact.subject || '(No subject)'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-neutral-gray text-sm">{new Date(contact.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleViewContact(contact)}
                              className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg transition-all text-sm"
                            >
                              <Eye size={14} />
                              View
                            </button>
                            <button
                              onClick={() => handleDelete(contact._id)}
                              className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg transition-all text-sm"
                            >
                              <Trash2 size={14} />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {selectedContact && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-neutral-black">Contact Details</h2>
                  <button
                    onClick={() => setSelectedContact(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X size={24} className="text-neutral-gray" />
                  </button>
                </div>
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-semibold text-neutral-gray mb-2">Name</h3>
                      <p className="text-neutral-black font-medium">{selectedContact.name}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-neutral-gray mb-2 flex items-center gap-2">
                        <Mail size={16} />
                        Email
                      </h3>
                      <a href={`mailto:${selectedContact.email}`} className="text-primary hover:underline">
                        {selectedContact.email}
                      </a>
                    </div>
                    {selectedContact.phone && (
                      <div>
                        <h3 className="text-sm font-semibold text-neutral-gray mb-2 flex items-center gap-2">
                          <Phone size={16} />
                          Phone
                        </h3>
                        <a href={`tel:${selectedContact.phone}`} className="text-primary hover:underline">
                          {selectedContact.phone}
                        </a>
                      </div>
                    )}
                    <div>
                      <h3 className="text-sm font-semibold text-neutral-gray mb-2 flex items-center gap-2">
                        <Calendar size={16} />
                        Submitted On
                      </h3>
                      <p className="text-neutral-black">{new Date(selectedContact.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                  {selectedContact.subject && (
                    <div>
                      <h3 className="text-sm font-semibold text-neutral-gray mb-2">Subject</h3>
                      <p className="text-neutral-black font-medium">{selectedContact.subject}</p>
                    </div>
                  )}
                  <div>
                    <h3 className="text-sm font-semibold text-neutral-gray mb-2">Message</h3>
                    <div className="bg-gray-50 p-4 rounded-lg text-neutral-black whitespace-pre-wrap">
                      {selectedContact.message}
                    </div>
                  </div>
                </div>
                <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex gap-3">
                  <button
                    onClick={() => handleDelete(selectedContact._id)}
                    className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-lg transition-all font-medium"
                  >
                    <Trash2 size={18} />
                    Delete
                  </button>
                  <button
                    onClick={() => setSelectedContact(null)}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-neutral-black px-6 py-2.5 rounded-lg transition-all font-medium"
                  >
                    Close
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

export default AdminContacts;
