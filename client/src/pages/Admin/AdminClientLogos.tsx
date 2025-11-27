import React, { useState, useEffect } from 'react';
import AdminSidebar from './components/AdminSidebar';
import { API_ENDPOINTS, ASSETS_CONFIG } from '../../config/api';
import { Plus, X, Loader2, Users, Edit2, Trash2 } from 'lucide-react';

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
  const [name, setName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

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
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch client logos');
      const data = await response.json();
      setClientLogos(data);
    } catch (error) {
      setError('Failed to fetch client logos');
    } finally {
      setLoading(false);
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
    setFormError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);

    try {
      if (!file && !editingLogo) throw new Error('Please select a logo image');

      let logoPath = editingLogo?.logo || '';

      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        const uploadResponse = await fetch(API_ENDPOINTS.UPLOAD, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        if (!uploadResponse.ok) throw new Error('Failed to upload logo');
        const uploadData = await uploadResponse.json();
        logoPath = uploadData.filePath;
      }

      const clientData = { name, logo: logoPath };
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

      if (!response.ok) throw new Error(`Failed to ${editingLogo ? 'update' : 'create'} client logo`);

      resetForm();
      fetchClientLogos();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this client logo?')) return;

    try {
      const response = await fetch(`${API_ENDPOINTS.CLIENTS}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to delete client logo');
      fetchClientLogos();
    } catch (error) {
      setError('Failed to delete client logo');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 p-4 lg:p-8 lg:ml-0 overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="bg-primary rounded-2xl p-6 shadow-lg mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold text-white mb-2">Client Logos Management</h1>
                <p className="text-white/90 text-sm sm:text-base">Manage your client company logos</p>
              </div>
              <button
                onClick={() => showAddForm ? resetForm() : setShowAddForm(true)}
                className="flex items-center gap-2 bg-white text-primary hover:bg-gray-100 px-6 py-3 rounded-lg transition-all shadow-lg font-semibold"
              >
                {showAddForm ? <X size={20} /> : <Plus size={20} />}
                {showAddForm ? 'Cancel' : 'Add New Logo'}
              </button>
            </div>
          </div>

          {showAddForm && (
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-neutral-black mb-6">
                {editingLogo ? 'Edit Client Logo' : 'Add New Client Logo'}
              </h2>
              {formError && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                  {formError}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-black mb-2">Client Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border border-neutral-light-gray rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-black mb-2">Logo Image *</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files && setFile(e.target.files[0])}
                    className="w-full px-4 py-3 border border-neutral-light-gray rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    required={!editingLogo}
                  />
                  {editingLogo && <p className="text-xs text-neutral-gray mt-2">Current logo will be kept if no new file is selected</p>}
                </div>

                <button
                  type="submit"
                  disabled={formLoading}
                  className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {formLoading ? 'Saving...' : editingLogo ? 'Update Logo' : 'Save Logo'}
                </button>
              </form>
            </div>
          )}

          {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">{error}</div>}

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
          ) : clientLogos.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl shadow-md">
              <Users className="w-16 h-16 text-neutral-gray mx-auto mb-4" />
              <p className="text-neutral-gray text-lg">No client logos found. Add some!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {clientLogos.map((logo) => (
                <div key={logo._id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6 border border-gray-100">
                  <div className="aspect-square bg-gray-50 rounded-lg mb-4 flex items-center justify-center p-4">
                    <img
                      src={`${ASSETS_CONFIG.BASE_URL}${logo.logo}`}
                      alt={logo.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <h3 className="font-semibold text-neutral-black text-center mb-2 truncate">{logo.name}</h3>
                  <p className="text-xs text-neutral-gray text-center mb-4">Added: {new Date(logo.createdAt).toLocaleDateString()}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(logo)}
                      className="flex-1 flex items-center justify-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg transition-all text-xs font-medium"
                    >
                      <Edit2 size={14} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(logo._id)}
                      className="flex-1 flex items-center justify-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition-all text-xs font-medium"
                    >
                      <Trash2 size={14} />
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

export default AdminClientLogos;
