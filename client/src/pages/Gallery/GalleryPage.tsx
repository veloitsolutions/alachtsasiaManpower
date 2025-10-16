import React, { useState, useCallback, useEffect } from "react";
import "./GalleryPage.css";
import { API_ENDPOINTS, ASSETS_CONFIG } from '../../config/api';

interface GalleryItem {
  _id?: string;
  type: "image" | "video";
  src: string; // image URL or YouTube video ID
  caption: string;
  thumbnail?: string; // for videos
}

const GalleryPage: React.FC = () => {
  const [filter, setFilter] = useState<"all" | "image" | "video">("all");
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGalleryItems = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.GALLERY);

        if (!response.ok) {
          throw new Error("Failed to fetch gallery items");
        }

        const data = await response.json();

        // Transform data if needed (e.g., for video items)
        const transformedData = data.map((item: GalleryItem) => {
          if (item.type === "video") {
            // For videos, only prepend server URL to thumbnail paths
            return {
              ...item,
              thumbnail: item.thumbnail
                ? `${ASSETS_CONFIG.BASE_URL}${item.thumbnail}`
                : "",
              // No transformation for video src as it should be a YouTube ID
              src: item.src,
            };
          } else {
            // For images, prepend server URL if it's a local path
            return {
              ...item,
              src: item.src.includes("http")
                ? item.src
                : `${ASSETS_CONFIG.BASE_URL}${item.src}`,
            };
          }
        });

        setGalleryItems(transformedData);
      } catch (error) {
        console.error("Error fetching gallery items:", error);
        setError("Failed to load gallery items. Please try again later.");

        // Fallback to default items if API fails
        setGalleryItems([
          {
            type: "image",
            src: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            caption: "Modern Office Space",
          },
          {
            type: "video",
            // This is a YouTube video ID - do not modify it
            src: "l-aV3qt6dKw",
            thumbnail: "https://img.youtube.com/vi/l-aV3qt6dKw/hqdefault.jpg",
            caption: "Group Discussion",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryItems();
  }, []);

  const filteredItems = galleryItems.filter((item) =>
    filter === "all" ? true : item.type === filter
  );

  const handleItemClick = useCallback((item: GalleryItem) => {
    setSelectedItem(item);
  }, []);

  const closeLightbox = useCallback(() => {
    setSelectedItem(null);
  }, []);

  const renderVideoIframe = (videoId: string) => (
    <iframe
      src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
      width="100%"
      height="480"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      title="YouTube video"
    ></iframe>
  );

  return (
    <div className="gallery-page">
      <section className="gallery-hero-section">
        <div className="gallery-hero-content">
          <h1>Our Gallery</h1>
          <p>Explore our journey through images and videos</p>
        </div>
      </section>

      <section className="gallery-content">
        <div className="container">
          <div className="gallery-filters">
            {["all", "image", "video"].map((type) => (
              <button
                key={type}
                className={`filter-button ${filter === type ? "active" : ""}`}
                onClick={() => setFilter(type as any)}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="gallery-loading">Loading gallery items...</div>
          ) : error ? (
            <div className="gallery-error">{error}</div>
          ) : filteredItems.length === 0 ? (
            <div className="gallery-empty">No gallery items found.</div>
          ) : (
            <div className="gallery-grid">
              {filteredItems.map((item, index) => (
                <div
                  key={item._id || index}
                  className="gallery-item"
                  onClick={() => handleItemClick(item)}
                >
                  {item.type === "image" ? (
                    <img src={item.src} alt={item.caption} loading="lazy" />
                  ) : (
                    <div className="video-thumbnail">
                      <img
                        src={item.thumbnail}
                        alt="Video thumbnail"
                        loading="lazy"
                      />
                      <div className="play-icon">▶</div>
                    </div>
                  )}
                  <div className="gallery-caption">
                    <p>{item.caption}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <div
        className={`lightbox ${selectedItem ? "active" : ""}`}
        onClick={closeLightbox}
      >
        {selectedItem && (
          <div
            className="lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="lightbox-close" onClick={closeLightbox}>
              ×
            </button>
            {selectedItem.type === "image" ? (
              <img src={selectedItem.src} alt={selectedItem.caption} />
            ) : (
              renderVideoIframe(selectedItem.src)
            )}
            <div className="lightbox-caption">{selectedItem.caption}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryPage;
