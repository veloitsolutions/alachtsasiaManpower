import React, { useState, useEffect } from 'react';
import AdminSidebar from './components/AdminSidebar';
import { API_ENDPOINTS, ASSETS_CONFIG } from '../../config/api';
import { extractYouTubeVideoId } from '../../utils/youtubeUtils';
import { Plus, X, Loader2, Image as ImageIcon, Video, Edit2, Trash2, Play } from 'lucide-react';
import { createImagePreviewUrl, convertHeicToJpegFile } from '../../utils/heicUtils';

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
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [type, setType] = useState<'image' | 'video'>('image');
  const [caption, setCaption] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string>('');
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

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
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch gallery items');
      const data = await response.json();
      setGalleryItems(data);
    } catch (error) {
      setError('Failed to fetch gallery items');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setType(item.type);
    setCaption(item.caption);
    setVideoUrl(item.type === 'video' ? item.src : '');
    setShowAddForm(true);
  };

  const resetForm = () => {
    setType('image');
    setCaption('');
    setFile(null);
    setFilePreview('');
    setVideoUrl('');
    setThumbnailFile(null);
    setThumbnailPreview('');
    setEditingItem(null);
    setShowAddForm(false);
    setFormError('');
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      try {
        // Convert HEIC to JPEG if needed
        const convertedFile = await convertHeicToJpegFile(selectedFile);
        setFile(convertedFile);
        const previewUrl = await createImagePreviewUrl(convertedFile);
        setFilePreview(previewUrl);
      } catch (error) {
        console.error('Error processing image:', error);
        setFormError('Failed to process image');
      }
    }
  };

  const handleThumbnailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      try {
        // Convert HEIC to JPEG if needed
        const convertedFile = await convertHeicToJpegFile(selectedFile);
        setThumbnailFile(convertedFile);
        const previewUrl = await createImagePreviewUrl(convertedFile);
        setThumbnailPreview(previewUrl);
      } catch (error) {
        console.error('Error processing thumbnail:', error);
        setFormError('Failed to create thumbnail preview');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);

    try {
      if (type === 'image' && !file && !editingItem) throw new Error('Please select an image file');
      if (type === 'video' && !videoUrl) throw new Error('Please enter a YouTube video URL');

      let finalVideoUrl = videoUrl;
      if (type === 'video') {
        const videoId = extractYouTubeVideoId(videoUrl);
        if (!videoId) throw new Error('Please enter a valid YouTube URL or video ID');
        finalVideoUrl = videoId;
      }

      if (type === 'video' && !thumbnailFile && !editingItem?.thumbnail) {
        throw new Error('Please select a thumbnail image for the video');
      }

      let imagePath = editingItem?.src || '';
      let thumbnailPath = editingItem?.thumbnail || '';

      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        const uploadResponse = await fetch(API_ENDPOINTS.UPLOAD, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        if (!uploadResponse.ok) throw new Error('Failed to upload image');
        const uploadData = await uploadResponse.json();
        imagePath = uploadData.filePath;
      }

      if (thumbnailFile) {
        const formData = new FormData();
        formData.append('file', thumbnailFile);
        const uploadResponse = await fetch(API_ENDPOINTS.UPLOAD, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        if (!uploadResponse.ok) throw new Error('Failed to upload thumbnail');
        const uploadData = await uploadResponse.json();
        thumbnailPath = uploadData.filePath;
      }

      const galleryData = {
        type,
        src: type === 'image' ? imagePath : finalVideoUrl,
        caption,
        thumbnail: type === 'video' ? thumbnailPath : undefined,
      };

      const url = editingItem ? `${API_ENDPOINTS.GALLERY}/${editingItem._id}` : API_ENDPOINTS.GALLERY;
      const method = editingItem ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(galleryData),
      });

      if (!response.ok) throw new Error(`Failed to ${editingItem ? 'update' : 'create'} gallery item`);

      resetForm();
      fetchGalleryItems();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      const response = await fetch(`${API_ENDPOINTS.GALLERY}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to delete gallery item');
      fetchGalleryItems();
    } catch (error) {
      setError('Failed to delete gallery item');
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
                <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold text-white mb-2">Gallery Management</h1>
                <p className="text-white/90 text-sm sm:text-base">Manage your gallery images and videos</p>
              </div>
              <button
                onClick={() => showAddForm ? resetForm() : setShowAddForm(true)}
                className="flex items-center gap-2 bg-white text-primary hover:bg-gray-100 px-6 py-3 rounded-lg transition-all shadow-lg font-semibold"
              >
                {showAddForm ? <X size={20} /> : <Plus size={20} />}
                {showAddForm ? 'Cancel' : 'Add New Item'}
              </button>
            </div>
          </div>

          {showAddForm && (
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-neutral-black mb-6">
                {editingItem ? 'Edit Gallery Item' : 'Add New Gallery Item'}
              </h2>
              {formError && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                  {formError}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-black mb-2">Type</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value as 'image' | 'video')}
                      className="w-full px-4 py-3 border border-neutral-light-gray rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      required
                    >
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-black mb-2">Caption</label>
                    <input
                      type="text"
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      className="w-full px-4 py-3 border border-neutral-light-gray rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      required
                    />
                  </div>
                </div>

                {type === 'image' ? (
                  <div>
                    <label className="block text-sm font-medium text-neutral-black mb-2">Image</label>
                    <input
                      type="file"
                      accept="image/*,.heic,.heif"
                      onChange={handleFileChange}
                      className="w-full px-4 py-3 border border-neutral-light-gray rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      required={!editingItem}
                    />
                    {filePreview && (
                      <div className="mt-3">
                        <img src={filePreview} alt="Preview" className="max-w-xs max-h-48 rounded-lg border border-neutral-light-gray" />
                      </div>
                    )}
                    {editingItem && <p className="text-xs text-neutral-gray mt-2">Current image will be kept if no new file is selected</p>}
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-neutral-black mb-2">YouTube Video URL</label>
                      <input
                        type="text"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        placeholder="e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                        className="w-full px-4 py-3 border border-neutral-light-gray rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                        required
                      />
                      <p className="text-xs text-neutral-gray mt-2">Paste the full YouTube URL or just the video ID</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-black mb-2">Video Thumbnail</label>
                      <input
                        type="file"
                        accept="image/*,.heic,.heif"
                        onChange={handleThumbnailChange}
                        className="w-full px-4 py-3 border border-neutral-light-gray rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                        required={!editingItem?.thumbnail}
                      />
                      {thumbnailPreview && (
                        <div className="mt-3">
                          <img src={thumbnailPreview} alt="Thumbnail Preview" className="max-w-xs max-h-48 rounded-lg border border-neutral-light-gray" />
                        </div>
                      )}
                      {editingItem?.thumbnail && <p className="text-xs text-neutral-gray mt-2">Current thumbnail will be kept if no new file is selected</p>}
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  disabled={formLoading}
                  className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {formLoading ? 'Saving...' : editingItem ? 'Update Item' : 'Save Item'}
                </button>
              </form>
            </div>
          )}

          {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">{error}</div>}

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
          ) : galleryItems.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl shadow-md">
              <ImageIcon className="w-16 h-16 text-neutral-gray mx-auto mb-4" />
              <p className="text-neutral-gray text-lg">No gallery items found. Add some!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryItems.map((item) => (
                <div key={item._id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden border border-gray-100">
                  <div className="relative aspect-video bg-gray-100">
                    {item.type === 'image' ? (
                      <img
                        src={`${ASSETS_CONFIG.BASE_URL}${item.src}`}
                        alt={item.caption}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="relative w-full h-full">
                        <img
                          src={item.thumbnail ? `${ASSETS_CONFIG.BASE_URL}${item.thumbnail}` : ''}
                          alt={item.caption}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <Play className="w-12 h-12 text-white" />
                        </div>
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${item.type === 'image' ? 'bg-blue-500' : 'bg-purple-500'} text-white`}>
                        {item.type === 'image' ? 'Image' : 'Video'}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-neutral-black mb-2 line-clamp-2">{item.caption}</h3>
                    <p className="text-xs text-neutral-gray mb-4">Added: {new Date(item.createdAt).toLocaleDateString()}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="flex-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-all text-sm font-medium"
                      >
                        <Edit2 size={16} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
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

export default AdminGallery;
