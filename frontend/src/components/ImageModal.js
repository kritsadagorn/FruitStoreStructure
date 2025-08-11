import React, { useEffect } from 'react';

const ImageModal = ({ images, currentIndex, onClose, onIndexChange, productName }) => {
  // Close modal when pressing Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [currentIndex]);

  const handleNext = () => {
    if (images.length > 1) {
      const nextIndex = (currentIndex + 1) % images.length;
      onIndexChange(nextIndex);
    }
  };

  const handlePrevious = () => {
    if (images.length > 1) {
      const prevIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
      onIndexChange(prevIndex);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!images || images.length === 0) return null;

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        
        {/* แสดงชื่อสินค้า */}
        {productName && (
          <div className="product-name-header">
            <h2>{productName}</h2>
          </div>
        )}
        
        <div className="modal-carousel">
          <img
            src={images[currentIndex]}
            alt={`รูปที่ ${currentIndex + 1}`}
            className="modal-image"
          />
          
          {images.length > 1 && (
            <>
              <button
                className="control-arrow control-prev"
                onClick={handlePrevious}
                aria-label="รูปก่อนหน้า"
              >
                <span>‹</span>
              </button>
              <button
                className="control-arrow control-next"
                onClick={handleNext}
                aria-label="รูปถัดไป"
              >
                <span>›</span>
              </button>
            </>
          )}
        </div>
        
        {images.length > 1 && (
          <div className="image-counter">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageModal;