import React, { useState, useEffect } from 'react';
import AdminSidebar from './components/AdminSidebar';
import AdminManpowerForm from './AdminManpowerForm';
import ManpowerCard from '../../components/ManpowerCard/ManpowerCard';
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
  type?: string;
  skills?: string[];
  education?: string;
  description?: string;
  createdAt: string;
}

interface FormData {
  jobTitle: string[];
  jobType: string;
  nameEng: string;
  nameArabic: string;
  nationality: string;
  religion: string;
  languages: string[];
  gender: string;
  age: number | null;
  maritalStatus: string;
  numberOfChildren: number | null;
  salary: string;
  manpowerFees: string;
  experience: string;
  aboutWorker: string;
  photo: File | null;
  resume: File | null;
}

const AdminManpower: React.FC = () => {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingWorker, setEditingWorker] = useState<Worker | null>(null);
  const [formLoading, setFormLoading] = useState(false);

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
      setWorkers(Array.isArray(data) ? data : []);
    } catch (error) {
      setError('Failed to load workers');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (formData: any, photo: File | null, resume: File | null, fullPhoto?: File | null) => {
    try {
      setFormLoading(true);
      setError('');

      const submitData = new FormData();
      
      // Basic Info
      if (formData.nameEng) submitData.append('nameEng', formData.nameEng);
      if (formData.nameArabic) submitData.append('nameArabic', formData.nameArabic);
      if (formData.jobTitle) submitData.append('jobTitle', JSON.stringify(formData.jobTitle));
      if (formData.jobType) submitData.append('jobType', formData.jobType);
      
      // Nationality & Religion
      if (formData.nationality) submitData.append('nationality', formData.nationality);
      if (formData.religion) submitData.append('religion', formData.religion);
      
      // Languages
      if (formData.languages) submitData.append('languages', JSON.stringify(formData.languages));
      
      // Personal Details
      if (formData.gender) submitData.append('gender', formData.gender);
      if (formData.age) submitData.append('age', String(formData.age));
      if (formData.maritalStatus) submitData.append('maritalStatus', formData.maritalStatus);
      if (formData.numberOfChildren !== null) submitData.append('numberOfChildren', String(formData.numberOfChildren || 0));
      
      // Experience
      if (formData.experience) submitData.append('experience', formData.experience);
      if (formData.gulfExperience) submitData.append('gulfExperience', JSON.stringify(formData.gulfExperience));
      
      // Salary & Fees
      if (formData.salary) submitData.append('salary', formData.salary);
      if (formData.salaryCurrency) submitData.append('salaryCurrency', formData.salaryCurrency);
      if (formData.manpowerFees) submitData.append('manpowerFees', formData.manpowerFees);
      if (formData.manpowerFeesCurrency) submitData.append('manpowerFeesCurrency', formData.manpowerFeesCurrency);
      if (formData.agencyFeeOption) submitData.append('agencyFeeOption', formData.agencyFeeOption);
      if (formData.hourlyRate) submitData.append('hourlyRate', String(formData.hourlyRate));
      if (formData.hourlyRateCurrency) submitData.append('hourlyRateCurrency', formData.hourlyRateCurrency);
      
      // Contact Information
      if (formData.candidateContactNumber) submitData.append('candidateContactNumber', formData.candidateContactNumber);
      if (formData.candidateContactNumber2) submitData.append('candidateContactNumber2', formData.candidateContactNumber2);
      if (formData.countryCode) submitData.append('countryCode', formData.countryCode);
      if (formData.countryCode2) submitData.append('countryCode2', formData.countryCode2);
      submitData.append('isContactNumberVisible', String(formData.isContactNumberVisible || false));
      if (formData.whatsappNumber) submitData.append('whatsappNumber', formData.whatsappNumber);
      
      // Worker Category
      if (formData.workerCategory) submitData.append('workerCategory', formData.workerCategory);
      if (formData.otherWorkerCategory) submitData.append('otherWorkerCategory', formData.otherWorkerCategory);
      if (formData.companyWorker) submitData.append('companyWorker', formData.companyWorker);
      if (formData.otherCompanyWorker) submitData.append('otherCompanyWorker', formData.otherCompanyWorker);
      
      // Location
      if (formData.currentLocation) submitData.append('currentLocation', formData.currentLocation);
      if (formData.drivingLicense) submitData.append('drivingLicense', JSON.stringify(formData.drivingLicense));
      
      // Other Details
      if (formData.horoscope) submitData.append('horoscope', formData.horoscope);
      if (formData.probationPeriod !== null) submitData.append('probationPeriod', String(formData.probationPeriod || 0));
      if (formData.referenceName) submitData.append('referenceName', formData.referenceName);
      submitData.append('isReferenceNameVisible', String(formData.isReferenceNameVisible || false));
      if (formData.offer) submitData.append('offer', formData.offer);
      if (formData.aboutWorker) submitData.append('aboutWorker', formData.aboutWorker);
      if (formData.videoFile) submitData.append('videoFile', formData.videoFile);
      
      // Other Countries Details
      if (formData.otherCountriesWorkersDetails) {
        submitData.append('otherCountriesWorkersDetails', JSON.stringify(formData.otherCountriesWorkersDetails));
      }

      // Files
      if (photo) submitData.append('photo', photo);
      if (fullPhoto) submitData.append('fullPhoto', fullPhoto);
      if (resume) submitData.append('resume', resume);

      const url = editingWorker
        ? `${API_ENDPOINTS.MANPOWER}/${editingWorker._id}`
        : API_ENDPOINTS.MANPOWER;

      const method = editingWorker ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: submitData,
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
      setError(error instanceof Error ? error.message : 'Failed to save worker');
      console.error(error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (worker: Worker) => {
    setEditingWorker(worker);
    setShowForm(true);
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

  const resetForm = () => {
    setEditingWorker(null);
    setShowForm(false);
    setError('');
  };

  const getInitialData = () => {
    if (!editingWorker) return undefined;
    return {
      nameEng: (editingWorker as any).nameEng || editingWorker.name,
      nameArabic: (editingWorker as any).nameArabic || '',
      jobTitle: Array.isArray((editingWorker as any).jobTitle) ? (editingWorker as any).jobTitle : editingWorker.jobTitle.split(', '),
      jobType: (editingWorker as any).jobType || 'full-time',
      nationality: editingWorker.nationality,
      religion: editingWorker.religion,
      languages: editingWorker.languages,
      gender: editingWorker.gender,
      age: editingWorker.age,
      maritalStatus: editingWorker.maritalStatus,
      numberOfChildren: editingWorker.numberOfChildren,
      experience: editingWorker.experience,
      gulfExperience: (editingWorker as any).gulfExperience || [],
      salary: editingWorker.salary,
      salaryCurrency: (editingWorker as any).salaryCurrency || 'QAR',
      manpowerFees: editingWorker.manpowerFees,
      manpowerFeesCurrency: (editingWorker as any).manpowerFeesCurrency || 'QAR',
      agencyFeeOption: (editingWorker as any).agencyFeeOption || '',
      hourlyRate: (editingWorker as any).hourlyRate || null,
      hourlyRateCurrency: (editingWorker as any).hourlyRateCurrency || 'QAR',
      candidateContactNumber: (editingWorker as any).candidateContactNumber || '',
      candidateContactNumber2: (editingWorker as any).candidateContactNumber2 || '',
      countryCode: (editingWorker as any).countryCode || '+966',
      countryCode2: (editingWorker as any).countryCode2 || '+966',
      isContactNumberVisible: (editingWorker as any).isContactNumberVisible || false,
      whatsappNumber: (editingWorker as any).whatsappNumber || '',
      workerCategory: (editingWorker as any).workerCategory || editingWorker.workerCategory,
      otherWorkerCategory: (editingWorker as any).otherWorkerCategory || '',
      companyWorker: (editingWorker as any).companyWorker || '',
      otherCompanyWorker: (editingWorker as any).otherCompanyWorker || '',
      currentLocation: (editingWorker as any).currentLocation || '',
      drivingLicense: (editingWorker as any).drivingLicense || [],
      horoscope: (editingWorker as any).horoscope || '',
      probationPeriod: (editingWorker as any).probationPeriod || null,
      referenceName: (editingWorker as any).referenceName || '',
      isReferenceNameVisible: (editingWorker as any).isReferenceNameVisible || false,
      offer: (editingWorker as any).offer || '',
      aboutWorker: editingWorker.aboutWorker,
      videoFile: (editingWorker as any).videoFile || '',
      existingPhoto: editingWorker.photo,
      existingFullPhoto: (editingWorker as any).fullPhoto || '',
      existingResume: editingWorker.resume,
      otherCountriesWorkersDetails: (editingWorker as any).otherCountriesWorkersDetails || [],
    };
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
              if (showForm) {
                resetForm();
              } else {
                setShowForm(true);
              }
            }}
            className="admin-add-button"
          >
            {showForm ? 'Cancel' : 'Add New Worker'}
          </button>
        </div>

        {showForm && (
          <AdminManpowerForm
            onSubmit={handleFormSubmit}
            onCancel={resetForm}
            initialData={getInitialData()}
            isLoading={formLoading}
          />
        )}

        {error && <div className="admin-error-message">{error}</div>}

        {loading ? (
          <div className="admin-loading">Loading...</div>
        ) : (
          <div className="admin-manpower-grid">
            {workers.length === 0 ? (
              <div className="admin-empty-state">
                No workers found. Add some!
              </div>
            ) : (
              workers.map((worker) => (
                <div key={worker._id} className="admin-manpower-card-wrapper">
                  <ManpowerCard worker={worker} />
                  <div className="admin-card-actions">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(worker);
                      }}
                      className="admin-edit-button"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(worker._id);
                      }}
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

export default AdminManpower;
