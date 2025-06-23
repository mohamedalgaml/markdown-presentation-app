import React from 'react';
import PropTypes from 'prop-types';
import { useSlides } from '../context/SlidesContext';
import { parseMarkdown } from '../utils/markdownParser';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary.jsx';
import { FaTrash } from 'react-icons/fa';
import './SlideViewer.css'; 

const SlideViewer = ({ onDelete }) => {
  const { slides, currentIndex, loading, error } = useSlides();

  if (loading) {
    return (
      <div className="slide-loading">
        <div className="spinner"></div>
        <p>Loading slides...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="slide-error">
        <h3>Error loading slides</h3>
        <p>{error.message || String(error)}</p>
        <button 
          onClick={() => window.location.reload()}
          className="retry-button"
        >
          Reload Presentation
        </button>
      </div>
    );
  }

  if (!slides || slides.length === 0) {
    return (
      <div className="slide-empty">
        <p>No slides found. Create your first slide!</p>
      </div>
    );
  }

  const safeIndex = Math.min(currentIndex, slides.length - 1);
  const slide = slides[safeIndex] || {};

  const { 
    layout = 'default', 
    title = '', 
    content = '', 
    id 
  } = slide;

  const renderLayout = () => {
    try {
      switch (layout) {
        case 'title-only':
          return (
            <h1 className="slide-title-only">
              {content || 'No content available'}
            </h1>
          );
        case 'code':
          return (
            <pre className="slide-code">
              <code>{content || '// No code content'}</code>
            </pre>
          );
        default:
          return (
            <div className="slide-default">
              {title && <h2 className="slide-title">{title}</h2>}
              <div className="slide-content">
                {parseMarkdown(content || '*No content provided.*')}
              </div>
            </div>
          );
      }
    } catch (e) {
      console.error("Error rendering slide layout:", e);
      return (
        <div className="slide-render-error">
          Error displaying this slide content
        </div>
      );
    }
  };

  return (
    <ErrorBoundary>
      <div className="slide-viewer-container">
        {onDelete && (
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to delete this slide?')) {
                onDelete(id);
              }
            }}
            className="delete-button"
            aria-label={`Delete slide ${safeIndex + 1}`}
          >
            <FaTrash className="icon" /> Delete Slide
          </button>
        )}
        
        <div className="slide-viewer">
          {renderLayout()}
        </div>

        <div className="slide-counter">
          Slide {safeIndex + 1} of {slides.length}
        </div>
      </div>
    </ErrorBoundary>
  );
};

SlideViewer.propTypes = {
  onDelete: PropTypes.func,
};

export default React.memo(SlideViewer);