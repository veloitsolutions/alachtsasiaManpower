import React, { useState, useEffect } from 'react';
import AdminSidebar from './components/AdminSidebar';
import './AdminStyles.css';
import { API_ENDPOINTS, ASSETS_CONFIG } from '../../config/api';

interface Worker {
  _id: string;
  name: string;
  jobTitle: string;
  workerCategory: string;
  nationality: string;
  religion: string;
  languages: string[];
  gender: string;
  maritalStatus: string;
  numberOfChildren: number;
  age: number;
  experience: string;
  salary: string;
  manpowerFees: string;
  photo: string;
  resume: string;
  aboutWorker: string;
  // Legacy fields for backward compatibility
  image?: string;
  type?: string;
  occupation?: string;
  skills?: string[];
  education?: string;
  description?: string;


  createdAt: string;
}

const AdminManpower: React.FC = () => {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingWorker, setEditingWorker] = useState<Worker | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    jobTitle: '',
    workerCategory: 'Domestic Worker',
    nationality: '',
    religion: '',
    languages: '',
    gender: 'Male',
    maritalStatus: 'Single',
    numberOfChildren: '',
    age: '',
    experience: '',
    salary: '',
    manpowerFees: '',
    aboutWorker: '',

  });

  const [photo, setPhoto] = useState<File | null>(null);
  const [resume, setResume] = useState<File | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const userInfoString = localStorage.getItem('userInfo');
  const userInfo = userInfoString ? JSON.parse(userInfoString) : null;
  const token = userInfo?.token;

  useEffect(() => {
    fetchWorkers();
  }, [token]);

  const fetchWorkers = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.MANPOWER, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized. Please log in again.');
        }
        throw new Error('Failed to fetch workers');
      }

      const data = await response.json();
      setWorkers(data);
    } catch (error) {
      setError('Failed to load workers');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResume(e.target.files[0]);
    }
  };

  const handleEdit = (worker: Worker) => {
    setEditingWorker(worker);
    setFormData({
      name: worker.name,
      jobTitle: worker.jobTitle || worker.occupation || '',
      workerCategory: worker.workerCategory || worker.type || 'Domestic Worker',
      nationality: worker.nationality,
      religion: worker.religion || '',
      languages: worker.languages?.join(', ') || '',
      gender: worker.gender,
      maritalStatus: worker.maritalStatus,
      numberOfChildren: worker.numberOfChildren?.toString() || '0',
      age: worker.age.toString(),
      experience: worker.experience,
      salary: worker.salary,
      manpowerFees: worker.manpowerFees,
      aboutWorker: worker.aboutWorker || worker.description || '',

    });
    setShowAddForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      jobTitle: '',
      workerCategory: 'Domestic Worker',
      nationality: '',
      religion: '',
      languages: '',
      gender: 'Male',
      maritalStatus: 'Single',
      numberOfChildren: '',
      age: '',
      experience: '',
      salary: '',
      manpowerFees: '',
      aboutWorker: '',

    });
    setPhoto(null);
    setResume(null);
    setEditingWorker(null);
    setShowAddForm(false);
    setFormError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!photo && !editingWorker) {
      setFormError('Please select a worker photo');
      return;
    }

    if (!formData.age || parseInt(formData.age) < 18 || parseInt(formData.age) > 65) {
      setFormError('Age must be between 18 and 65');
      return;
    }

    try {
      setFormLoading(true);
      setFormError('');

      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      if (photo) {
        formDataToSend.append('photo', photo);
      }

      if (resume) {
        formDataToSend.append('resume', resume);
      }

      const url = editingWorker 
        ? `${API_ENDPOINTS.MANPOWER}/${editingWorker._id}`
        : API_ENDPOINTS.MANPOWER;

      const method = editingWorker ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 401) {
          throw new Error('Unauthorized. Please log in again.');
        }
        throw new Error(errorData.message || 'Failed to save worker');
      }

      resetForm();
      fetchWorkers();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Failed to save worker');
      console.error(error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this worker?')) {
      return;
    }

    try {
      const response = await fetch(`${API_ENDPOINTS.MANPOWER}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete worker');
      }

      setWorkers(workers.filter(item => item._id !== id));
    } catch (error) {
      setError('Failed to delete worker');
      console.error(error);
    }
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <div className="admin-content">
        <div className="admin-header">
          <h1>Manpower Management</h1>
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
            className="admin-add-button"
          >
            {showAddForm ? 'Cancel' : 'Add New Worker'}
          </button>
        </div>

        {showAddForm && (
          <div className="admin-form-container">
            <h2>{editingWorker ? 'Edit Worker' : 'Add New Worker'}</h2>
            {formError && <div className="admin-error-message">{formError}</div>}
            <form onSubmit={handleSubmit} className="admin-form manpower-form">
              {/* Name - Age */}
              <div className="form-row">
                <div className="admin-form-group">
                  <label htmlFor="name">Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label htmlFor="age">Age *</label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    min="18"
                    max="65"
                    required
                  />
                </div>
              </div>

              {/* Job Title */}
              <div className="admin-form-group">
                <label htmlFor="jobTitle">Job Title * (separate with commas)</label>
                <input
                  type="text"
                  id="jobTitle"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleInputChange}
                  placeholder="e.g., Housekeeper, Cook, Driver, Nurse"
                  required
                />
              </div>

              {/* Worker Category */}
              <div className="admin-form-group">
                <label htmlFor="workerCategory">Worker Category *</label>
                <select
                  id="workerCategory"
                  name="workerCategory"
                  value={formData.workerCategory}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Domestic Worker">Domestic Worker</option>
                  <option value="Recruitment worker">Recruitment worker</option>
                  <option value="Returned labor">Returned labor</option>
                  <option value="Monthly contract labor">Monthly contract labor</option>
                  <option value="Multi Skilled Labour">Multi Skilled Labour</option>
                  <option value="Company Worker">Company Worker</option>
                </select>
              </div>

              {/* Nationality - Religion */}
              <div className="form-row">
                <div className="admin-form-group">
                  <label htmlFor="nationality">Nationality *</label>
                  <input
                    type="text"
                    id="nationality"
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label htmlFor="religion">Religion</label>
                  <input
                    type="text"
                    id="religion"
                    name="religion"
                    value={formData.religion}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Languages */}
              <div className="admin-form-group">
                <label htmlFor="languages">Languages (separate with commas)</label>
                <input
                  type="text"
                  id="languages"
                  name="languages"
                  value={formData.languages}
                  onChange={handleInputChange}
                  placeholder="e.g., English, Arabic, Hindi"
                />
              </div>

              {/* Gender - Marital Status - Number of Children */}
              <div className="form-row-3">
                <div className="admin-form-group">
                  <label htmlFor="gender">Gender *</label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="admin-form-group">
                  <label htmlFor="maritalStatus">Marital Status *</label>
                  <select
                    id="maritalStatus"
                    name="maritalStatus"
                    value={formData.maritalStatus}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                </div>

                <div className="admin-form-group">
                  <label htmlFor="numberOfChildren">Number of Children</label>
                  <input
                    type="number"
                    id="numberOfChildren"
                    name="numberOfChildren"
                    value={formData.numberOfChildren}
                    onChange={handleInputChange}
                    min="0"
                    max="20"
                  />
                </div>
              </div>

              {/* Experience (Years) */}
              <div className="admin-form-group">
                <label htmlFor="experience">Experience (Years) *</label>
                <input
                  type="text"
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  placeholder="e.g., 5 years, 2-3 years"
                  required
                />
              </div>

              {/* Salary - Manpower Fees */}
              <div className="form-row">
                <div className="admin-form-group">
                  <label htmlFor="salary">Salary *</label>
                  <input
                    type="text"
                    id="salary"
                    name="salary"
                    value={formData.salary}
                    onChange={handleInputChange}
                    placeholder="e.g., $800-$1000, AED 2000"
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label htmlFor="manpowerFees">Manpower Fees *</label>
                  <input
                    type="text"
                    id="manpowerFees"
                    name="manpowerFees"
                    value={formData.manpowerFees}
                    onChange={handleInputChange}
                    placeholder="e.g., $500, AED 1500"
                    required
                  />
                </div>
              </div>

              {/* Photo - Resume */}
              <div className="form-row">
                <div className="admin-form-group">
                  <label htmlFor="photo">Photo *</label>
                  <input
                    type="file"
                    id="photo"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/bmp,image/webp,image/svg+xml,image/tiff,image/ico,image/avif"
                    onChange={handlePhotoChange}
                    required={!editingWorker}
                  />
                  {editingWorker && (
                    <small>Current photo will be kept if no new file is selected</small>
                  )}
                </div>

                <div className="admin-form-group">
                  <label htmlFor="resume">Resume</label>
                  <input
                    type="file"
                    id="resume"
                    accept=".pdf,.doc,.docx,.txt,.rtf"
                    onChange={handleResumeChange}
                  />
                  {editingWorker && editingWorker.resume && (
                    <small>Current resume will be kept if no new file is selected</small>
                  )}
                </div>
              </div>

              {/* About Worker */}
              <div className="admin-form-group">
                <label htmlFor="aboutWorker">About Worker</label>
                <textarea
                  id="aboutWorker"
                  name="aboutWorker"
                  value={formData.aboutWorker}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Brief description about the worker..."
                />
              </div>

              <button
                type="submit"
                className="admin-submit-button"
                disabled={formLoading}
              >
                {formLoading ? 'Saving...' : editingWorker ? 'Update Worker' : 'Save Worker'}
              </button>
            </form>
          </div>
        )}

        {error && <div className="admin-error-message">{error}</div>}

        {loading ? (
          <div className="admin-loading">Loading...</div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Photo</th>
                  <th>Name</th>
                  <th>Job Title</th>
                  <th>Nationality</th>
                  <th>Age/Gender</th>

                  <th>Salary</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {workers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="admin-empty-state">
                      No workers found. Add some!
                    </td>
                  </tr>
                ) : (
                  workers.map((worker) => (
                    <tr key={worker._id}>
                      <td>
                        <img
                          src={`${ASSETS_CONFIG.BASE_URL}${worker.photo || worker.image}`}
                          alt={worker.name}
                          className="admin-table-image"
                        />
                      </td>
                      <td>
                        <strong>{worker.name}</strong>
                        <br />
                        <small>{worker.jobTitle || worker.occupation}</small>
                      </td>
                      <td>{worker.jobTitle || worker.occupation}</td>
                      <td>{worker.nationality}</td>
                      <td>{worker.age} yrs • {worker.gender}</td>

                      <td>{worker.salary}</td>
                      <td>
                        <div className="admin-item-actions">
                          <button
                            onClick={() => handleEdit(worker)}
                            className="admin-edit-button"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(worker._id)}
                            className="admin-delete-button"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminManpower;
