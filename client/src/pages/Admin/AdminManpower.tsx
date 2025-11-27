import React, { useState, useEffect } from 'react';
import AdminSidebar from './components/AdminSidebar';
import AdminManpowerForm from './AdminManpowerForm';
import ManpowerCard from '../../components/ManpowerCard/ManpowerCard';
import { API_ENDPOINTS } from '../../config/api';
import { Plus, X, Loader2, Briefcase } from 'lucide-react';

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
        if (response.status === 401) throw new Error('Unauthorized. Please log in again.');
        throw new Error('Failed to fetch workers');
      }

      const data = await response.json();
      setWorkers(Array.isArray(data) ? data : []);
    } catch (error) {
      setError('Failed to load workers');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (formData: any, photo: File | null, resume: File | null, fullPhoto?: File | null) => {
    try {
      setFormLoading(true);
      setError('');

      const submitData = new FormData();
      
      if (formData.nameEng) submitData.append('nameEng', formData.nameEng);
      if (formData.nameArabic) submitData.append('nameArabic', formData.nameArabic);
      if (formData.jobTitle) submitData.append('jobTitle', JSON.stringify(formData.jobTitle));
      if (formData.jobType) submitData.append('jobType', formData.jobType);
      if (formData.nationality) submitData.append('nationality', formData.nationality);
      if (formData.religion) submitData.append('religion', formData.religion);
      if (formData.languages) submitData.append('languages', JSON.stringify(formData.languages));
      if (formData.gender) submitData.append('gender', formData.gender);
      if (formData.age) submitData.append('age', String(formData.age));
      if (formData.maritalStatus) submitData.append('maritalStatus', formData.maritalStatus);
      if (formData.numberOfChildren !== null) submitData.append('numberOfChildren', String(formData.numberOfChildren || 0));
      if (formData.experience) submitData.append('experience', formData.experience);
      if (formData.gulfExperience) submitData.append('gulfExperience', JSON.stringify(formData.gulfExperience));
      if (formData.salary) submitData.append('salary', formData.salary);
      if (formData.salaryCurrency) submitData.append('salaryCurrency', formData.salaryCurrency);
      if (formData.manpowerFees) submitData.append('manpowerFees', formData.manpowerFees);
      if (formData.manpowerFeesCurrency) submitData.append('manpowerFeesCurrency', formData.manpowerFeesCurrency);
      if (formData.agencyFeeOption) submitData.append('agencyFeeOption', formData.agencyFeeOption);
      if (formData.hourlyRate) submitData.append('hourlyRate', String(formData.hourlyRate));
      if (formData.hourlyRateCurrency) submitData.append('hourlyRateCurrency', formData.hourlyRateCurrency);
      if (formData.candidateContactNumber) submitData.append('candidateContactNumber', formData.candidateContactNumber);
      if (formData.candidateContactNumber2) submitData.append('candidateContactNumber2', formData.candidateContactNumber2);
      if (formData.countryCode) submitData.append('countryCode', formData.countryCode);
      if (formData.countryCode2) submitData.append('countryCode2', formData.countryCode2);
      submitData.append('isContactNumberVisible', String(formData.isContactNumberVisible || false));
      if (formData.whatsappNumber) submitData.append('whatsappNumber', formData.whatsappNumber);
      if (formData.workerCategory) submitData.append('workerCategory', formData.workerCategory);
      if (formData.otherWorkerCategory) submitData.append('otherWorkerCategory', formData.otherWorkerCategory);
      if (formData.companyWorker) submitData.append('companyWorker', formData.companyWorker);
      if (formData.otherCompanyWorker) submitData.append('otherCompanyWorker', formData.otherCompanyWorker);
      if (formData.currentLocation) submitData.append('currentLocation', formData.currentLocation);
      if (formData.drivingLicense) submitData.append('drivingLicense', JSON.stringify(formData.drivingLicense));
      if (formData.horoscope) submitData.append('horoscope', formData.horoscope);
      if (formData.probationPeriod !== null) submitData.append('probationPeriod', String(formData.probationPeriod || 0));
      if (formData.referenceName) submitData.append('referenceName', formData.referenceName);
      submitData.append('isReferenceNameVisible', String(formData.isReferenceNameVisible || false));
      if (formData.offer) submitData.append('offer', formData.offer);
      if (formData.aboutWorker) submitData.append('aboutWorker', formData.aboutWorker);
      if (formData.videoFile) submitData.append('videoFile', formData.videoFile);
      if (formData.otherCountriesWorkersDetails) {
        submitData.append('otherCountriesWorkersDetails', JSON.stringify(formData.otherCountriesWorkersDetails));
      }

      if (photo) submitData.append('photo', photo);
      if (fullPhoto) submitData.append('fullPhoto', fullPhoto);
      if (resume) submitData.append('resume', resume);

      const url = editingWorker
        ? `${API_ENDPOINTS.MANPOWER}/${editingWorker._id}`
        : API_ENDPOINTS.MANPOWER;

      const method = editingWorker ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Authorization': `Bearer ${token}` },
        body: submitData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 401) throw new Error('Unauthorized. Please log in again.');
        throw new Error(errorData.message || 'Failed to save worker');
      }

      resetForm();
      fetchWorkers();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to save worker');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (worker: Worker) => {
    setEditingWorker(worker);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this worker?')) return;

    try {
      const response = await fetch(`${API_ENDPOINTS.MANPOWER}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to delete worker');

      setWorkers(workers.filter(item => item._id !== id));
    } catch (error) {
      setError('Failed to delete worker');
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
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 p-4 lg:p-8 lg:ml-0 overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="bg-primary rounded-2xl p-6 shadow-lg mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold text-white mb-2">Manpower Management</h1>
                <p className="text-white/90 text-sm sm:text-base">Manage your workers and manpower</p>
              </div>
              <button
                onClick={() => showForm ? resetForm() : setShowForm(true)}
                className="flex items-center gap-2 bg-white text-primary hover:bg-gray-100 px-6 py-3 rounded-lg transition-all shadow-lg font-semibold"
              >
                {showForm ? <X size={20} /> : <Plus size={20} />}
                {showForm ? 'Cancel' : 'Add New Worker'}
              </button>
            </div>
          </div>

          {showForm && (
            <div className="mb-8">
              <AdminManpowerForm
                onSubmit={handleFormSubmit}
                onCancel={resetForm}
                initialData={getInitialData()}
                isLoading={formLoading}
              />
            </div>
          )}

          {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">{error}</div>}

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
          ) : workers.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl shadow-md">
              <Briefcase className="w-16 h-16 text-neutral-gray mx-auto mb-4" />
              <p className="text-neutral-gray text-lg">No workers found. Add some!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {workers.map((worker) => (
                <div key={worker._id} className="flex flex-col gap-3">
                  <ManpowerCard worker={worker} />
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(worker);
                      }}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-all text-sm font-medium shadow-lg"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(worker._id);
                      }}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all text-sm font-medium shadow-lg"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminManpower;
