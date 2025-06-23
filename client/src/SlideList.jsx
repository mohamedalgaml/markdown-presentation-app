import React, { useContext } from 'react';
import { SlidesContext } from '../context/SlidesContext';
import './SlideList.css';

const SlideList = ({ onSelect, onDelete }) => {
  const { slides, currentIndex, setCurrentIndex, loading } = useContext(SlidesContext);

  if (loading && !slides.length) {
    return <div className="loading-placeholder">Loading slides...</div>;
  }

  if (!slides.length) {
    return (
      <div className="empty-list">
        <p>No slides found. Create one to get started!</p>
      </div>
    );
  }

  return (
    <div className="slide-list-container">
      <div className="slide-list-header">
        <h3>Slides</h3>
        <span className="counter">{slides.length} items</span>
      </div>
      
      <div className="slides-scroll-container">
        <ul className="slide-list">
          {slides.map((slide, index) => {
            const isActive = index === currentIndex;
            return (
              <li
                key={slide.id}
                className={`slide-item ${isActive ? 'active' : ''}`}
                onClick={() => {
                  setCurrentIndex(index);
                  if (onSelect) onSelect(slide, index);
                }}
              >
                <div className="slide-item-content">
                  <span className="slide-number">{index + 1}</span>
                  <div className="slide-info">
                    <h4 className="slide-title">
                      {slide.title || `Slide ${index + 1}`}
                    </h4>
                    <p className="slide-layout">{slide.layout}</p>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(slide.id);
                  }}
                  className="delete-button"
                  aria-label={`Delete slide ${index + 1}`}
                >
                  🗑️
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default SlideList;