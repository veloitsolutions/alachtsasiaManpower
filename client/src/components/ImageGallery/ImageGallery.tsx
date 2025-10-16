import React, { useState } from 'react';
import './ImageGallery.css';

interface GalleryItem {
  type: 'image' | 'video';
  src: string;
  caption: string;
  thumbnail?: string;
}

interface ImageGalleryProps {
  items: GalleryItem[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ items }) => {
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  const openLightbox = (item: GalleryItem) => {
    if (item.type === 'image') {
      setSelectedImage(item);
    }
  };

  return (
    <>
      <div className="gallery-grid">
        {items.map((item, index) => (
          <div 
            key={index} 
            className="gallery-item"
            onClick={() => openLightbox(item)}
          >
            {item.type === 'image' ? (
              <img src={item.src} alt={item.caption} loading="lazy" />
            ) : (
              <video 
                src={item.src}
                poster={item.thumbnail}
                controls
                preload="metadata"
              />
            )}
            <div className="gallery-caption">
              <p>{item.caption}</p>
            </div>
          </div>
        ))}
      </div>

      <div className={`lightbox ${selectedImage ? 'active' : ''}`} onClick={() => setSelectedImage(null)}>
        {selectedImage && (
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setSelectedImage(null)}>×</button>
            <img src={selectedImage.src} alt={selectedImage.caption} />
            <div className="lightbox-caption">{selectedImage.caption}</div>
          </div>
        )}
      </div>
    </>
  );
};

export default ImageGallery;