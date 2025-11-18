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
  const [editingLogo, setEditingLogo] = useState<ClientLogo | null>(null);

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

  const handleEdit = (logo: ClientLogo) => {
    setEditingLogo(logo);
    setName(logo.name);
    setShowAddForm(true);
  };

  const resetForm = () => {
    setName('');
    setFile(null);
    setEditingLogo(null);
    setShowAddForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);

    try {
      if (!file && !editingLogo) {
        throw new Error('Please select a logo image');
      }

      let logoPath = editingLogo?.logo || '';

      // Upload logo file if present
      if (file) {
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
        logoPath = uploadData.filePath;
      }

      // Create or update client logo
      const clientData = {
        name,
        logo: logoPath,
      };

      const url = editingLogo ? `${API_ENDPOINTS.CLIENTS}/${editingLogo._id}` : API_ENDPOINTS.CLIENTS;
      const method = editingLogo ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(clientData),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${editingLogo ? 'update' : 'create'} client logo`);
      }

      // Reset form
      resetForm();

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
            onClick={() => {
              if (showAddForm) {
                resetForm();
              } else {
                setShowAddForm(true);
              }
            }}
            className="admin-action-button"
          >
            {showAddForm ? 'Cancel' : 'Add New Logo'}
          </button>
        </div>

        {showAddForm && (
          <div className="admin-form-container">
            <h2>{editingLogo ? 'Edit Client Logo' : 'Add New Client Logo'}</h2>
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
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/bmp,image/webp,image/svg+xml,image/tiff,image/ico,image/avif"
                  onChange={handleFileChange}
                  required={!editingLogo}
                />
                {editingLogo && (
                  <small>Current logo will be kept if no new file is selected</small>
                )}
              </div>

              <button
                type="submit"
                className="admin-submit-button"
                disabled={formLoading}
              >
                {formLoading ? 'Saving...' : editingLogo ? 'Update Logo' : 'Save Logo'}
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
              <div className="admin-empty-state">
                <p>No client logos found. Add some!</p>
              </div>
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
                    <div className="admin-item-actions">
                      <button
                        onClick={() => handleEdit(logo)}
                        className="admin-edit-button"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(logo._id)}
                        className="admin-delete-button"
                      >
                        Delete
                      </button>
                    </div>
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











