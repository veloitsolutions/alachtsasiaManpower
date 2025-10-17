import React, { useState, useEffect } from 'react';
import AdminSidebar from './components/AdminSidebar';
import './AdminStyles.css';
import { API_ENDPOINTS, ASSETS_CONFIG } from '../../config/api';

interface TeamMember {
  _id: string;
  name: string;
  role: string;
  image: string;
  bio: string;
  createdAt: string;
}

const AdminTeamMembers: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Form state
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  // const [bio, setBio] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const userInfoString = localStorage.getItem('userInfo');
  const userInfo = userInfoString ? JSON.parse(userInfoString) : null;
  const token = userInfo?.token;

  useEffect(() => {
    fetchTeamMembers();
  }, [token]);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.TEAM_MEMBERS, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized. Please log in again.');
        }
        throw new Error('Failed to fetch team members');
      }

      const data = await response.json();
      setTeamMembers(data);
    } catch (error) {
      setError('Failed to load team members');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!image) {
      setFormError('Please select an image');
      return;
    }

    try {
      setFormLoading(true);
      setFormError('');

      const formData = new FormData();
      formData.append('name', name);
      formData.append('role', role);
      // formData.append('bio', bio);
      if (image) {
        formData.append('image', image);
      }

      const response = await fetch(API_ENDPOINTS.TEAM_MEMBERS, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 401) {
          throw new Error('Unauthorized. Please log in again.');
        }
        throw new Error(errorData.message || 'Failed to add team member');
      }

      // Reset form
      setName('');
      setRole('');
      // setBio('');
      setImage(null);
      setShowAddForm(false);

      // Refresh team members list
      fetchTeamMembers();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Failed to add team member');
      console.error(error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this team member?')) {
      return;
    }

    try {
      const response = await fetch(`${API_ENDPOINTS.TEAM_MEMBERS}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete team member');
      }

      // Remove from state
      setTeamMembers(teamMembers.filter(item => item._id !== id));
    } catch (error) {
      setError('Failed to delete team member');
      console.error(error);
    }
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <div className="admin-content">
        <div className="admin-header">
          <h1>Team Members Management</h1>
        </div>

        <div className="admin-actions">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="admin-add-button"
          >
            {showAddForm ? 'Cancel' : 'Add New Team Member'}
          </button>
        </div>

        {showAddForm && (
          <div className="admin-form-container">
            <h2>Add New Team Member</h2>
            {formError && <div className="admin-error-message">{formError}</div>}
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="admin-form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="role">Role/Position</label>
                <input
                  type="text"
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g., Founder & CEO, Operations Manager"
                  required
                />
              </div>

              {/* <div className="admin-form-group">
                <label htmlFor="bio">Bio (Optional)</label>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  placeholder="Brief description about the team member..."
                />
              </div> */}

              <div className="admin-form-group">
                <label htmlFor="image">Profile Photo</label>
                <input
                  type="file"
                  id="image"
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
                {formLoading ? 'Saving...' : 'Save Team Member'}
              </button>
            </form>
          </div>
        )}

        {error && <div className="admin-error-message">{error}</div>}

        {loading ? (
          <div className="admin-loading">Loading...</div>
        ) : (
          <div className="admin-team-grid">
            {teamMembers.length === 0 ? (
              <p>No team members found. Add some!</p>
            ) : (
              teamMembers.map((member) => (
                <div key={member._id} className="admin-team-item">
                  <div className="admin-team-header">
                    <img
                      src={`${ASSETS_CONFIG.BASE_URL}${member.image}`}
                      alt={member.name}
                      className="admin-team-image"
                    />
                    <div>
                      <h3>{member.name}</h3>
                      <p className="admin-team-role">{member.role}</p>
                      {member.bio && <p className="admin-team-bio">{member.bio}</p>}
                    </div>
                  </div>
                  <div className="admin-team-footer">
                    <p>Added: {new Date(member.createdAt).toLocaleDateString()}</p>
                    <button
                      onClick={() => handleDelete(member._id)}
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

export default AdminTeamMembers;
