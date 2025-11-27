import React, { useState, useEffect } from 'react';
import AdminSidebar from './components/AdminSidebar';
import { API_ENDPOINTS, ASSETS_CONFIG } from '../../config/api';
import { Plus, X, Loader2, Users, Edit2, Trash2 } from 'lucide-react';

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
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
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
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to fetch team members');
      const data = await response.json();
      setTeamMembers(data);
    } catch (error) {
      setError('Failed to load team members');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member);
    setName(member.name);
    setRole(member.role);
    setShowAddForm(true);
  };

  const resetForm = () => {
    setName('');
    setRole('');
    setImage(null);
    setEditingMember(null);
    setShowAddForm(false);
    setFormError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!image && !editingMember) {
      setFormError('Please select an image');
      return;
    }

    try {
      setFormLoading(true);
      setFormError('');

      if (editingMember) {
        if (!image) {
          const updateData = { name, role };
          const response = await fetch(`${API_ENDPOINTS.TEAM_MEMBERS}/${editingMember._id}`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(updateData),
          });
          if (!response.ok) throw new Error('Failed to update team member');
        } else {
          const formData = new FormData();
          formData.append('name', name);
          formData.append('role', role);
          formData.append('image', image);
          const response = await fetch(`${API_ENDPOINTS.TEAM_MEMBERS}/${editingMember._id}`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData,
          });
          if (!response.ok) throw new Error('Failed to update team member');
        }
      } else {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('role', role);
        if (image) formData.append('image', image);
        const response = await fetch(API_ENDPOINTS.TEAM_MEMBERS, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData,
        });
        if (!response.ok) throw new Error('Failed to add team member');
      }

      resetForm();
      fetchTeamMembers();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Failed to save team member');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this team member?')) return;

    try {
      const response = await fetch(`${API_ENDPOINTS.TEAM_MEMBERS}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to delete team member');
      setTeamMembers(teamMembers.filter(item => item._id !== id));
    } catch (error) {
      setError('Failed to delete team member');
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
                <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold text-white mb-2">Team Members Management</h1>
                <p className="text-white/90 text-sm sm:text-base">Manage your team members</p>
              </div>
              <button
                onClick={() => showAddForm ? resetForm() : setShowAddForm(true)}
                className="flex items-center gap-2 bg-white text-primary hover:bg-gray-100 px-6 py-3 rounded-lg transition-all shadow-lg font-semibold"
              >
                {showAddForm ? <X size={20} /> : <Plus size={20} />}
                {showAddForm ? 'Cancel' : 'Add New Team Member'}
              </button>
            </div>
          </div>

          {showAddForm && (
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-neutral-black mb-6">
                {editingMember ? 'Edit Team Member' : 'Add New Team Member'}
              </h2>
              {formError && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                  {formError}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-black mb-2">Name *</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 border border-neutral-light-gray rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-black mb-2">Role/Position *</label>
                    <input
                      type="text"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="e.g., Founder & CEO, Operations Manager"
                      className="w-full px-4 py-3 border border-neutral-light-gray rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-black mb-2">Profile Photo *</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files && setImage(e.target.files[0])}
                    className="w-full px-4 py-3 border border-neutral-light-gray rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    required={!editingMember}
                  />
                  {editingMember && <p className="text-xs text-neutral-gray mt-2">Current image will be kept if no new file is selected</p>}
                </div>

                <button
                  type="submit"
                  disabled={formLoading}
                  className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {formLoading ? 'Saving...' : editingMember ? 'Update Team Member' : 'Save Team Member'}
                </button>
              </form>
            </div>
          )}

          {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">{error}</div>}

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
          ) : teamMembers.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl shadow-md">
              <Users className="w-16 h-16 text-neutral-gray mx-auto mb-4" />
              <p className="text-neutral-gray text-lg">No team members found. Add some!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {teamMembers.map((member) => (
                <div key={member._id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden border border-gray-100">
                  <div className="aspect-square bg-gray-100">
                    <img
                      src={`${ASSETS_CONFIG.BASE_URL}${member.image}`}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-neutral-black text-lg mb-1">{member.name}</h3>
                    <p className="text-sm text-primary mb-2">{member.role}</p>
                    {member.bio && <p className="text-xs text-neutral-gray mb-3 line-clamp-2">{member.bio}</p>}
                    <p className="text-xs text-neutral-gray mb-4">Added: {new Date(member.createdAt).toLocaleDateString()}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(member)}
                        className="flex-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-all text-sm font-medium"
                      >
                        <Edit2 size={16} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(member._id)}
                        className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all text-sm font-medium"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
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

export default AdminTeamMembers;
