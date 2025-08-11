import React, { useState, useEffect, useCallback } from 'react';
import { getRecommendedProducts } from '../services/api';
import './RecommendedProductsCarousel.css';

const RecommendedProductsCarousel = ({ onImageClick }) => {
  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [autoplay, setAutoplay] = useState(true);
  
  // Fetch recommended products
  const fetchRecommendedProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getRecommendedProducts();
      setProducts(response.data || []);
    } catch (error) {
      console.error('Error fetching recommended products:', error);
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchRecommendedProducts();
  }, [fetchRecommendedProducts]);
  
  // Auto-slide functionality
  useEffect(() => {
    if (!autoplay || products.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
    }, 5000); // Change slide every 5 seconds
    
    return () => clearInterval(interval);
  }, [autoplay, products.length]);
  
  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? products.length - 1 : prevIndex - 1
    );
    setAutoplay(false); // Pause autoplay when manually navigating
  };
  
  const handleNext = () => {
    setCurrentIndex((prevIndex) => 
      (prevIndex + 1) % products.length
    );
    setAutoplay(false); // Pause autoplay when manually navigating
  };
  
  // Resume autoplay after 10 seconds of inactivity
  useEffect(() => {
    if (autoplay) return;
    
    const timeout = setTimeout(() => {
      setAutoplay(true);
    }, 10000);
    
    return () => clearTimeout(timeout);
  }, [autoplay]);
  
  if (loading && products.length === 0) {
    return null; // Don't show anything while initially loading
  }
  
  if (products.length === 0) {
    return null; // Don't show carousel if no recommended products
  }
  
  const currentProduct = products[currentIndex];
  
  // Handle image click to open modal
  const handleImageClick = (images, index) => {
    if (onImageClick && images && images.length > 0) {
      onImageClick(images, index);
    }
  };
  
  return (
    <div className="recommended-carousel-container">
      <div className="recommended-carousel">
        <div className="carousel-track" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
          {products.map((product, index) => (
            <div key={index} className="carousel-slide">
              <div className="carousel-content">
                <div className="product-carousel-image-container">
                  <img 
                    src={product.images[0]} 
                    alt={product.name} 
                    className="product-carousel-image"
                    onClick={() => {
                      if (onImageClick && product.images && product.images.length > 0) {
                        onImageClick(product.images, 0);
                      }
                    }}
                  />
                  <img 
                    src="https://img2.pic.in.th/pic/0aa9fef2bd47248a965dfff70b6dea90.png" 
                    alt="Best Seller" 
                    className="best-seller-badge"
                  />
                </div>
                <div className="product-carousel-info">
                  <h3>{product.name}</h3>
                  <p>{product.category?.name || 'ไม่มีหมวดหมู่'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {products.length > 1 && (
          <>
            <button 
              className="carousel-control carousel-prev" 
              onClick={handlePrevious}
              aria-label="Previous product"
            >
              ‹
            </button>
            <button 
              className="carousel-control carousel-next" 
              onClick={handleNext}
              aria-label="Next product"
            >
              ›
            </button>
            
            <div className="carousel-indicators">
              {products.map((_, index) => (
                <button 
                  key={index}
                  className={`carousel-indicator ${index === currentIndex ? 'active' : ''}`}
                  onClick={() => {
                    setCurrentIndex(index);
                    setAutoplay(false);
                  }}
                  aria-label={`Go to product ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RecommendedProductsCarousel;