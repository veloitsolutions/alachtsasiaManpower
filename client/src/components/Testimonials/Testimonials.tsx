import React, { useState, useEffect, useCallback, useRef } from 'react';
import './Testimonials.css';

interface Testimonial {
  _id: string;
  name: string;
  position: string;
  image: string;
  rating: number;
  review: string;
  createdAt: string;
}

const Testimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const autoPlayRef = useRef<number | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  
  // Touch handling
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const fetchTestimonials = useCallback(async () => {
    try {
      const response = await fetch('https://intralinkgroup.net/api/testimonials');
      
      if (!response.ok) {
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
  }, []);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  // Auto-play functionality
  useEffect(() => {
    if (testimonials.length > 1) {
      autoPlayRef.current = setInterval(() => {
        nextTestimonial();
      }, 5000);
    }
    
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [testimonials, currentIndex]);

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`testimonial-star ${i <= rating ? 'filled' : 'empty'}`} 
              aria-hidden="true">
          ★
        </span>
      );
    }
    return (
      <div className="testimonial-rating" aria-label={`Rating: ${rating} out of 5 stars`}>
        {stars}
      </div>
    );
  };

  const truncateReview = (review: string) => {
    const minLength = 150;
    const maxLength = 200;
    
    if (review.length < minLength) {
      return review;
    }
    
    if (review.length > maxLength) {
      return review.substring(0, maxLength) + '...';
    }
    
    return review;
  };

  const nextTestimonial = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  }, [testimonials.length]);

  const prevTestimonial = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  }, [testimonials.length]);

  const goToTestimonial = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      prevTestimonial();
    } else if (e.key === 'ArrowRight') {
      nextTestimonial();
    }
  }, [prevTestimonial, nextTestimonial]);

  // Handle touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      nextTestimonial();
    }
    
    if (touchStart - touchEnd < -50) {
      prevTestimonial();
    }
  };

  // Handle image error
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = 'https://intralinkgroup.net/placeholder-avatar.png'; // Fallback image
  };

  // Format image URL correctly
  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return 'https://intralinkgroup.net/placeholder-avatar.png';
    
    // If it's already a full URL, return it
    if (imagePath.startsWith('http')) return imagePath;
    
    // If it's a relative path, add the base URL
    return `https://intralinkgroup.net${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}`;
  };

  return (
    <section className="section testimonials-section">
      <div className="container">
        <h2 className="section-title">What Our Clients Say</h2>
        
        {loading ? (
          <div className="testimonials-loading" aria-live="polite">Loading testimonials...</div>
        ) : error ? (
          <div className="testimonials-error" aria-live="assertive">{error}</div>
        ) : testimonials.length === 0 ? (
          <div className="testimonials-empty" aria-live="polite">No testimonials available.</div>
        ) : (
          <div 
            className="testimonials-carousel" 
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="region"
            aria-label="Testimonials carousel"
          >
            <div 
              className="testimonials-slider" 
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              ref={sliderRef}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {testimonials.map((testimonial, index) => (
                <div 
                  key={testimonial._id} 
                  className="testimonial-slide"
                  aria-hidden={currentIndex !== index}
                >
                  <div className="testimonial-card">
                    <div className="testimonial-quote-icon" aria-hidden="true">❝</div>
                    <div className="testimonial-text">
                      {truncateReview(testimonial.review)}
                    </div>
                    <div className="testimonial-author">
                      <img 
                        src={getImageUrl(testimonial.image)} 
                        alt=""
                        className="testimonial-image"
                        onError={handleImageError}
                        loading="lazy"
                      />
                      <div className="testimonial-info">
                        <div className="testimonial-name">{testimonial.name}</div>
                        <div className="testimonial-role">{testimonial.position}</div>
                      </div>
                    </div>
                    {renderStars(testimonial.rating)}
                  </div>
                </div>
              ))}
            </div>
            
            <button 
              className="testimonial-nav prev" 
              onClick={prevTestimonial}
              aria-label="Previous testimonial"
            >
              ‹
            </button>
            <button 
              className="testimonial-nav next" 
              onClick={nextTestimonial}
              aria-label="Next testimonial"
            >
              ›
            </button>
            
            <div className="testimonial-dots" role="tablist">
              {testimonials.map((_, index) => (
                <button 
                  key={index} 
                  className={`testimonial-dot ${index === currentIndex ? 'active' : ''}`}
                  onClick={() => goToTestimonial(index)}
                  aria-label={`Go to testimonial ${index + 1}`}
                  aria-selected={index === currentIndex}
                  role="tab"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;




