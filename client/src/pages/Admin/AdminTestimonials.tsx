import React, { useState, useEffect } from 'react';
import AdminSidebar from './components/AdminSidebar';
import { API_ENDPOINTS, ASSETS_CONFIG } from '../../config/api';
import { Plus, X, Loader2, Star, Edit2, Trash2, MessageSquare } from 'lucide-react';
import { createImagePreviewUrl, convertHeicToJpegFile } from '../../utils/heicUtils';

interface Testimonial {
  _id: string;
  name: string;
  position: string;
  image: string;
  rating: number;
  review: string;
  createdAt: string;
}

const AdminTestimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      try {
        // Convert HEIC to JPEG if needed
        const convertedFile = await convertHeicToJpegFile(selectedFile);
        setImage(convertedFile);
        const previewUrl = await createImagePreviewUrl(convertedFile);
        setImagePreview(previewUrl);
      } catch (error) {
        console.error('Error processing image:', error);
        setFormError('Failed to process image');
      }
    }
  };

  const userInfoString = localStorage.getItem('userInfo');
  const userInfo = userInfoString ? JSON.parse(userInfoString) : null;
  const token = userInfo?.token;

  useEffect(() => {
    fetchTestimonials();
  }, [token]);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.TESTIMONIALS, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to fetch testimonials');
      const data = await response.json();
      setTestimonials(data);
    } catch (error) {
      setError('Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setName(testimonial.name);
    setPosition(testimonial.position);
    setRating(testimonial.rating);
    setReview(testimonial.review);
    setShowAddForm(true);
  };

  const resetForm = () => {
    setName('');
    setPosition('');
    setRating(5);
    setReview('');
    setImage(null);
    setEditingTestimonial(null);
    setShowAddForm(false);
    setFormError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!image && !editingTestimonial) {
      setFormError('Please select an image');
      return;
    }

    if (review.length > 100) {
      setFormError(`Review is too long. Maximum 100 characters allowed.`);
      return;
    }

    try {
      setFormLoading(true);
      setFormError('');

      if (editingTestimonial) {
        if (!image) {
          const updateData = { name, position, rating, review };
          const response = await fetch(`${API_ENDPOINTS.TESTIMONIALS}/${editingTestimonial._id}`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(updateData),
          });
          if (!response.ok) throw new Error('Failed to update testimonial');
        } else {
          const formData = new FormData();
          formData.append('name', name);
          formData.append('position', position);
          formData.append('rating', rating.toString());
          formData.append('review', review);
          formData.append('image', image);
          const response = await fetch(`${API_ENDPOINTS.TESTIMONIALS}/${editingTestimonial._id}`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData,
          });
          if (!response.ok) throw new Error('Failed to update testimonial');
        }
      } else {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('position', position);
        formData.append('rating', rating.toString());
        formData.append('review', review);
        if (image) formData.append('image', image);
        const response = await fetch(API_ENDPOINTS.TESTIMONIALS, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData,
        });
        if (!response.ok) throw new Error('Failed to add testimonial');
      }

      resetForm();
      fetchTestimonials();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Failed to save testimonial');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this testimonial?')) return;

    try {
      const response = await fetch(`${API_ENDPOINTS.TESTIMONIALS}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to delete testimonial');
      setTestimonials(testimonials.filter(item => item._id !== id));
    } catch (error) {
      setError('Failed to delete testimonial');
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} size={16} className={i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
    ));
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 p-4 lg:p-8 lg:ml-0 overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="bg-primary rounded-2xl p-6 shadow-lg mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold text-white mb-2">Testimonials Management</h1>
                <p className="text-white/90 text-sm sm:text-base">Manage client testimonials and reviews</p>
              </div>
              <button
                onClick={() => showAddForm ? resetForm() : setShowAddForm(true)}
                className="flex items-center gap-2 bg-white text-primary hover:bg-gray-100 px-6 py-3 rounded-lg transition-all shadow-lg font-semibold"
              >
                {showAddForm ? <X size={20} /> : <Plus size={20} />}
                {showAddForm ? 'Cancel' : 'Add New Testimonial'}
              </button>
            </div>
          </div>

          {showAddForm && (
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-neutral-black mb-6">
                {editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
              </h2>
              {formError && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                  {formError}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <label className="block text-sm font-medium text-neutral-black mb-2">Position/Company</label>
                    <input
                      type="text"
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      placeholder="CEO, Company Name (Optional)"
                      className="w-full px-4 py-3 border border-neutral-light-gray rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-black mb-2">Rating (1-5 stars) *</label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full px-4 py-3 border border-neutral-light-gray rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    required
                  >
                    {[1, 2, 3, 4, 5].map(num => (
                      <option key={num} value={num}>{num} Star{num > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-black mb-2">Review *</label>
                  <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    rows={4}
                    maxLength={100}
                    className="w-full px-4 py-3 border border-neutral-light-gray rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    required
                  />
                  <p className={`text-xs mt-2 ${review.length > 80 ? 'text-red-600' : 'text-neutral-gray'}`}>
                    {review.length}/100 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-black mb-2">Client Photo *</label>
                  <input
                    type="file"
                    accept="image/*,.heic,.heif"
                    onChange={handleImageChange}
                    className="w-full px-4 py-3 border border-neutral-light-gray rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    required={!editingTestimonial}
                  />
                  {imagePreview && (
                    <div className="mt-3">
                      <img src={imagePreview} alt="Preview" className="max-w-xs max-h-48 rounded-lg border border-neutral-light-gray" />
                    </div>
                  )}
                  {editingTestimonial && <p className="text-xs text-neutral-gray mt-2">Current image will be kept if no new file is selected</p>}
                </div>

                <button
                  type="submit"
                  disabled={formLoading}
                  className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {formLoading ? 'Saving...' : editingTestimonial ? 'Update Testimonial' : 'Save Testimonial'}
                </button>
              </form>
            </div>
          )}

          {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">{error}</div>}

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
          ) : testimonials.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl shadow-md">
              <MessageSquare className="w-16 h-16 text-neutral-gray mx-auto mb-4" />
              <p className="text-neutral-gray text-lg">No testimonials found. Add some!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((testimonial) => (
                <div key={testimonial._id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6 border border-gray-100">
                  <div className="flex items-start gap-4 mb-4">
                    <img
                      src={`${ASSETS_CONFIG.BASE_URL}${testimonial.image}`}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-neutral-black">{testimonial.name}</h3>
                      {testimonial.position && <p className="text-sm text-neutral-gray">{testimonial.position}</p>}
                      <div className="flex gap-1 mt-2">{renderStars(testimonial.rating)}</div>
                    </div>
                  </div>
                  <p className="text-neutral-gray text-sm mb-4 italic">"{testimonial.review}"</p>
                  <p className="text-xs text-neutral-gray mb-4">Added: {new Date(testimonial.createdAt).toLocaleDateString()}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(testimonial)}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-all text-sm font-medium"
                    >
                      <Edit2 size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(testimonial._id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all text-sm font-medium"
                    >
                      <Trash2 size={16} />
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

export default AdminTestimonials;
