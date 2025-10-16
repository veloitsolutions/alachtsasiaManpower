import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import AdminSidebar from './components/AdminSidebar';
import './AdminStyles.css';
import { API_ENDPOINTS } from '../../config/api';

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

  // const navigate = useNavigate();

  const userInfoString = localStorage.getItem('userInfo');
  const userInfo = userInfoString ? JSON.parse(userInfoString) : null;
  const token = userInfo?.token;

  useEffect(() => {
    fetchContacts();
  }, [token]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.CONTACT, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch contacts');
      }

      const data = await response.json();
      setContacts(data);
    } catch (error) {
      setError('Failed to fetch contacts');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // const handleLogout = () => {
  //   localStorage.removeItem('userInfo');
  //   navigate('/admin/login');
  // };

  const handleViewContact = async (contact: Contact) => {
    setSelectedContact(contact);

    // Mark as read if not already read
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
          // Update local state
          setContacts(contacts.map(c =>
            c._id === contact._id ? { ...c, isRead: true } : c
          ));
        }
      } catch (error) {
        console.error('Failed to mark contact as read', error);
      }
    }
  };

  const handleCloseModal = () => {
    setSelectedContact(null);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this contact submission?')) {
      return;
    }

    try {
      const response = await fetch(`${API_ENDPOINTS.CONTACT}/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete contact');
      }

      // Close modal if the deleted contact was selected
      if (selectedContact && selectedContact._id === id) {
        setSelectedContact(null);
      }

      // Refresh contacts
      fetchContacts();
    } catch (error) {
      setError('Failed to delete contact');
      console.error(error);
    }
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <div className="admin-content">
        <div className="admin-header">
          <h1>Contact Submissions</h1>
          {/* <button onClick={handleLogout} className="admin-logout-button admin_logout_button" style={{display: 'block', visibility: 'visible', opacity: 1}}>Logout</button> */}
        </div>

        {error && <div className="admin-error-message">{error}</div>}

        {loading ? (
          <div className="admin-loading">Loading...</div>
        ) : (
          <div className="admin-contacts-container">
            {contacts.length === 0 ? (
              <p>No contact submissions found.</p>
            ) : (
              <table className="admin-contacts-table">
                <thead>
                  <tr>
                    <th>Status</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Subject</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((contact) => (
                    <tr
                      key={contact._id}
                      className={contact.isRead ? '' : 'admin-contact-unread'}
                    >
                      <td>
                        <span className={`admin-contact-status ${contact.isRead ? 'read' : 'unread'}`}>
                          {contact.isRead ? 'Read' : 'Unread'}
                        </span>
                      </td>
                      <td>{contact.name}</td>
                      <td>{contact.email}</td>
                      <td>{contact.subject || '(No subject)'}</td>
                      <td>{new Date(contact.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button
                          onClick={() => handleViewContact(contact)}
                          className="admin-view-button"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleDelete(contact._id)}
                          className="admin-delete-button"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Contact Detail Modal */}
        {selectedContact && (
          <div className="admin-modal">
            <div className="admin-modal-content">
              <div className="admin-modal-header">
                <h2>Contact Details</h2>
                <button onClick={handleCloseModal} className="admin-modal-close">&times;</button>
              </div>
              <div className="admin-modal-body">
                <div className="admin-contact-detail">
                  <h3>Name</h3>
                  <p>{selectedContact.name}</p>
                </div>
                <div className="admin-contact-detail">
                  <h3>Email</h3>
                  <p><a href={`mailto:${selectedContact.email}`}>{selectedContact.email}</a></p>
                </div>
                {selectedContact.phone && (
                  <div className="admin-contact-detail">
                    <h3>Phone</h3>
                    <p><a href={`tel:${selectedContact.phone}`}>{selectedContact.phone}</a></p>
                  </div>
                )}
                {selectedContact.subject && (
                  <div className="admin-contact-detail">
                    <h3>Subject</h3>
                    <p>{selectedContact.subject}</p>
                  </div>
                )}
                <div className="admin-contact-detail">
                  <h3>Message</h3>
                  <div className="admin-contact-message">{selectedContact.message}</div>
                </div>
                <div className="admin-contact-detail">
                  <h3>Submitted On</h3>
                  <p>{new Date(selectedContact.createdAt).toLocaleString()}</p>
                </div>
              </div>
              <div className="admin-modal-footer">
                <button
                  onClick={() => handleDelete(selectedContact._id)}
                  className="admin-delete-button"
                >
                  Delete
                </button>
                <button onClick={handleCloseModal} className="admin-cancel-button">Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminContacts;

