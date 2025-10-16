import React, { useState, useEffect } from 'react';
import AdminSidebar from './components/AdminSidebar';
import './AdminStyles.css';
import { API_ENDPOINTS } from '../../config/api';

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
  
  // Form state
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

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
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized. Please log in again.');
        }
        throw new Error('Failed to fetch testimonials');
      }

      const data = await response.json();
      setTestimonials(data);
    } catch (error) {
      setError('Failed to load testimonials');
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

    // Check review length
    const maxReviewLength = 200;
    if (review.length > maxReviewLength) {
      setFormError(`Review is too long. Maximum ${maxReviewLength} characters allowed.`);
      return;
    }

    try {
      setFormLoading(true);
      setFormError('');

      const formData = new FormData();
      formData.append('name', name);
      formData.append('position', position);
      formData.append('rating', rating.toString());
      formData.append('review', review);
      if (image) {
        formData.append('image', image);
      }

      const response = await fetch(API_ENDPOINTS.TESTIMONIALS, {
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
        throw new Error(errorData.message || 'Failed to add testimonial');
      }

      // Reset form
      setName('');
      setPosition('');
      setRating(5);
      setReview('');
      setImage(null);
      setShowAddForm(false);

      // Refresh testimonials list
      fetchTestimonials();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Failed to add testimonial');
      console.error(error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this testimonial?')) {
      return;
    }

    try {
      const response = await fetch(`${API_ENDPOINTS.TESTIMONIALS}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete testimonial');
      }

      // Remove from state
      setTestimonials(testimonials.filter(item => item._id !== id));
    } catch (error) {
      setError('Failed to delete testimonial');
      console.error(error);
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`admin-star ${i <= rating ? 'filled' : 'empty'}`}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <div className="admin-content">
        <div className="admin-header">
          <h1>Testimonials Management</h1>
        </div>

        <div className="admin-actions">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="admin-add-button"
          >
            {showAddForm ? 'Cancel' : 'Add New Testimonial'}
          </button>
        </div>

        {showAddForm && (
          <div className="admin-form-container">
            <h2>Add New Testimonial</h2>
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
                <label htmlFor="position">Position/Company</label>
                <input
                  type="text"
                  id="position"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="CEO, Company Name (Optional)"
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="rating">Rating (1-5 stars)</label>
                <select
                  id="rating"
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  required
                >
                  <option value="1">1 Star</option>
                  <option value="2">2 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="5">5 Stars</option>
                </select>
              </div>

              <div className="admin-form-group">
                <label htmlFor="review">Review</label>
                <textarea
                  id="review"
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  rows={4}
                  required
                  maxLength={200}
                />
                <small className={review.length > 180 ? "admin-char-count warning" : "admin-char-count"}>
                  {review.length}/200 characters
                </small>
              </div>

              <div className="admin-form-group">
                <label htmlFor="image">Client Photo</label>
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
                {formLoading ? 'Saving...' : 'Save Testimonial'}
              </button>
            </form>
          </div>
        )}

        {error && <div className="admin-error-message">{error}</div>}

        {loading ? (
          <div className="admin-loading">Loading...</div>
        ) : (
          <div className="admin-testimonials-grid">
            {testimonials.length === 0 ? (
              <p>No testimonials found. Add some!</p>
            ) : (
              testimonials.map((testimonial) => (
                <div key={testimonial._id} className="admin-testimonial-item">
                  <div className="admin-testimonial-header">
                    <img
                      src={`https://intralinkgroup.net${testimonial.image}`}
                      alt={testimonial.name}
                      className="admin-testimonial-image"
                    />
                    <div>
                      <h3>{testimonial.name}</h3>
                      {testimonial.position && <p>{testimonial.position}</p>}
                      <div className="admin-testimonial-rating">
                        {renderStars(testimonial.rating)}
                      </div>
                    </div>
                  </div>
                  <div className="admin-testimonial-review">
                    "{testimonial.review}"
                  </div>
                  <div className="admin-testimonial-footer">
                    <p>Added: {new Date(testimonial.createdAt).toLocaleDateString()}</p>
                    <button
                      onClick={() => handleDelete(testimonial._id)}
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

export default AdminTestimonials;






