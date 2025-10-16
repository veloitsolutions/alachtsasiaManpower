import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import AdminSidebar from './components/AdminSidebar';
import './AdminStyles.css';
import { API_ENDPOINTS, ASSETS_CONFIG } from '../../config/api';

interface ClientLogo {
  _id: string;
  name: string;
  logo: string;
  createdAt: string;
}

const AdminClientLogos: React.FC = () => {
  const [clientLogos, setClientLogos] = useState<ClientLogo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  // const navigate = useNavigate();

  const userInfoString = localStorage.getItem('userInfo');
  const userInfo = userInfoString ? JSON.parse(userInfoString) : null;
  const token = userInfo?.token;

  useEffect(() => {
    fetchClientLogos();
  }, [token]);

  const fetchClientLogos = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.CLIENTS, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch client logos');
      }

      const data = await response.json();
      setClientLogos(data);
    } catch (error) {
      setError('Failed to fetch client logos');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // const handleLogout = () => {
  //   localStorage.removeItem('userInfo');
  //   navigate('/admin/login');
  // };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);

    try {
      if (!file) {
        throw new Error('Please select a logo image');
      }

      // Upload logo file
      const formData = new FormData();
      formData.append('file', file);

        const uploadResponse = await fetch(API_ENDPOINTS.UPLOAD, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload logo');
      }

      const uploadData = await uploadResponse.json();
      const logoPath = uploadData.filePath;

      // Create client logo
      const clientData = {
        name,
        logo: logoPath,
      };

      const response = await fetch(API_ENDPOINTS.CLIENTS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(clientData),
      });

      if (!response.ok) {
        throw new Error('Failed to create client logo');
      }

      // Reset form
      setName('');
      setFile(null);
      setShowAddForm(false);

      // Refresh client logos
      fetchClientLogos();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this client logo?')) {
      return;
    }

    try {
      const response = await fetch(`${API_ENDPOINTS.CLIENTS}/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete client logo');
      }

      // Refresh client logos
      fetchClientLogos();
    } catch (error) {
      setError('Failed to delete client logo');
      console.error(error);
    }
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <div className="admin-content">
        <div className="admin-header">
          <h1>Client Logos Management</h1>
          {/* <button onClick={handleLogout} className="admin-logout-button admin_logout_button" style={{display: 'block', visibility: 'visible', opacity: 1}}>Logout</button> */}
        </div>

        <div className="admin-actions">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="admin-action-button"
          >
            {showAddForm ? 'Cancel' : 'Add New Logo'}
          </button>
        </div>

        {showAddForm && (
          <div className="admin-form-container">
            <h2>Add New Client Logo</h2>
            {formError && <div className="admin-error-message">{formError}</div>}
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="admin-form-group">
                <label htmlFor="name">Client Name</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="logo">Logo Image</label>
                <input
                  type="file"
                  id="logo"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                />
              </div>

              <button
                type="submit"
                className="admin-submit-button"
                disabled={formLoading}
              >
                {formLoading ? 'Saving...' : 'Save Logo'}
              </button>
            </form>
          </div>
        )}

        {error && <div className="admin-error-message">{error}</div>}

        {loading ? (
          <div className="admin-loading">Loading...</div>
        ) : (
          <div className="admin-logo-grid">
            {clientLogos.length === 0 ? (
              <p>No client logos found. Add some!</p>
            ) : (
              clientLogos.map((logo) => (
                <div key={logo._id} className="admin-logo-item">
                  <img
                    src={`${ASSETS_CONFIG.BASE_URL}${logo.logo}`}
                    alt={logo.name}
                    className="admin-logo-image"
                  />
                  <div className="admin-logo-details">
                    <h3>{logo.name}</h3>
                    <p>Added: {new Date(logo.createdAt).toLocaleDateString()}</p>
                    <button
                      onClick={() => handleDelete(logo._id)}
                      className="admin-delete-button"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminClientLogos;











