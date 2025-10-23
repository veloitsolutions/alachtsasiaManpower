import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import AdminSidebar from './components/AdminSidebar';
import './AdminStyles.css';
import { API_ENDPOINTS, ASSETS_CONFIG } from '../../config/api';
import { extractYouTubeVideoId, isValidYouTubeUrl } from '../../utils/youtubeUtils';

interface GalleryItem {
  _id: string;
  type: 'image' | 'video';
  src: string;
  caption: string;
  thumbnail?: string;
  createdAt: string;
}

const AdminGallery: React.FC = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Form states
  const [type, setType] = useState<'image' | 'video'>('image');
  const [caption, setCaption] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  // const navigate = useNavigate();

  const userInfoString = localStorage.getItem('userInfo');
  const userInfo = userInfoString ? JSON.parse(userInfoString) : null;
  const token = userInfo?.token;

  useEffect(() => {
    fetchGalleryItems();
  }, [token]);

  const fetchGalleryItems = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.GALLERY, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch gallery items');
      }

      const data = await response.json();
      setGalleryItems(data);
    } catch (error) {
      setError('Failed to fetch gallery items');
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

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setThumbnailFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);

    try {
      if (type === 'image' && !file) {
        throw new Error('Please select an image file');
      }

      if (type === 'video' && !videoUrl) {
        throw new Error('Please enter a YouTube video URL');
      }

      // Extract video ID from URL if it's a video
      let finalVideoUrl = videoUrl;
      if (type === 'video') {
        const videoId = extractYouTubeVideoId(videoUrl);
        if (!videoId) {
          throw new Error('Please enter a valid YouTube URL or video ID');
        }
        finalVideoUrl = videoId;
      }

      if (type === 'video' && !thumbnailFile) {
        throw new Error('Please select a thumbnail image for the video');
      }

      let imagePath = '';
      let thumbnailPath = '';

      // Upload image file if present
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
          throw new Error('Failed to upload image');
        }

        const uploadData = await uploadResponse.json();
        imagePath = uploadData.filePath;
      }

      // Upload thumbnail if present
      if (thumbnailFile) {
        const formData = new FormData();
        formData.append('file', thumbnailFile);

        const uploadResponse = await fetch(API_ENDPOINTS.UPLOAD, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload thumbnail');
        }

        const uploadData = await uploadResponse.json();
        thumbnailPath = uploadData.filePath;
      }

      // Create gallery item
      const galleryData = {
        type,
        src: type === 'image' ? imagePath : finalVideoUrl,
        caption,
        thumbnail: type === 'video' ? thumbnailPath : undefined,
      };

      const response = await fetch(API_ENDPOINTS.GALLERY, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(galleryData),
      });

      if (!response.ok) {
        throw new Error('Failed to create gallery item');
      }

      // Reset form
      setType('image');
      setCaption('');
      setFile(null);
      setVideoUrl('');
      setThumbnailFile(null);
      setShowAddForm(false);

      // Refresh gallery items
      fetchGalleryItems();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      const response = await fetch(`${API_ENDPOINTS.GALLERY}/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete gallery item');
      }

      // Refresh gallery items
      fetchGalleryItems();
    } catch (error) {
      setError('Failed to delete gallery item');
      console.error(error);
    }
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <div className="admin-content">
        <div className="admin-header">
          <h1>Gallery Management</h1>
          {/* <button onClick={handleLogout} className="admin-logout-button admin_logout_button" style={{display: 'block', visibility: 'visible', opacity: 1}}>Logout</button> */}
        </div>

        <div className="admin-actions">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="admin-action-button"
          >
            {showAddForm ? 'Cancel' : 'Add New Item'}
          </button>
        </div>

        {showAddForm && (
          <div className="admin-form-container">
            <h2>Add New Gallery Item</h2>
            {formError && <div className="admin-error-message">{formError}</div>}
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="admin-form-group">
                <label htmlFor="type">Type</label>
                <select
                  id="type"
                  value={type}
                  onChange={(e) => setType(e.target.value as 'image' | 'video')}
                  required
                >
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                </select>
              </div>

              <div className="admin-form-group">
                <label htmlFor="caption">Caption</label>
                <input
                  type="text"
                  id="caption"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  required
                />
              </div>

              {type === 'image' ? (
                <div className="admin-form-group">
                  <label htmlFor="image">Image</label>
                  <input
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={handleFileChange}
                    required
                  />
                </div>
              ) : (
                <>
                  <div className="admin-form-group">
                    <label htmlFor="videoUrl">YouTube Video URL</label>
                    <input
                      type="text"
                      id="videoUrl"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                      required
                    />
                    <small className="admin-form-help">
                      Paste the full YouTube URL or just the video ID
                    </small>
                  </div>
                  <div className="admin-form-group">
                    <label htmlFor="thumbnail">Video Thumbnail</label>
                    <input
                      type="file"
                      id="thumbnail"
                      accept="image/*"
                      onChange={handleThumbnailChange}
                      required
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                className="admin-submit-button"
                disabled={formLoading}
              >
                {formLoading ? 'Saving...' : 'Save Item'}
              </button>
            </form>
          </div>
        )}

        {error && <div className="admin-error-message">{error}</div>}

        {loading ? (
          <div className="admin-loading">Loading...</div>
        ) : (
          <div className="admin-gallery-grid">
            {galleryItems.length === 0 ? (
              <div className="admin-empty-state">
                <p>No gallery items found. Add some!</p>
              </div>
            ) : (
              galleryItems.map((item) => (
                <div key={item._id} className="admin-gallery-item">
                  {item.type === 'image' ? (
                    <img
                      src={`${ASSETS_CONFIG.BASE_URL}${item.src}`}
                      alt={item.caption}
                      className="admin-gallery-image"
                    />
                  ) : (
                    <div className="admin-gallery-video">
                      <img
                        src={item.thumbnail ? `${ASSETS_CONFIG.BASE_URL}${item.thumbnail}`
                          : ''}
                        alt={`Thumbnail for ${item.caption}`}
                        className="admin-gallery-thumbnail"
                      />
                      <div className="admin-gallery-play-icon">▶</div>
                    </div>
                  )}
                  <div className="admin-gallery-details">
                    <h3>{item.caption}</h3>
                    <p>Type: {item.type}</p>
                    <p>Added: {new Date(item.createdAt).toLocaleDateString()}</p>
                    <button
                      onClick={() => handleDelete(item._id)}
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

export default AdminGallery;
















