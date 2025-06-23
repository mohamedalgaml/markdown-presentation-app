import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

const SlideList = ({ slides = [], onSelect, onDelete }) => {
  if (!Array.isArray(slides)) {
    return <p>No slides available.</p>;
  }

  return (
    <div style={{ marginBottom: '1rem', fontFamily: 'Arial, sans-serif' }}>
      <h3 style={{ color: '#333', marginBottom: '0.8rem', fontSize: '1.2rem' }}>
        Slide List
      </h3>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {slides.map((slide, index) => (
          <li
            key={slide.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.5rem',
              padding: '0.8rem',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              background: '#fff',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              transition: 'all 0.2s ease',
            }}
          >
            <div style={{ flex: 1 }}>
              <span
                style={{ cursor: 'pointer', fontWeight: '500', color: '#333' }}
                onClick={() => onSelect && onSelect(slide, index)}
                aria-label={`Select slide ${slide.order + 1}`}
              >
                #{slide.order + 1}: {slide.title || 'Untitled Slide'}
              </span>
              {slide.content && (
                <p style={{ margin: '0.3rem 0 0', color: '#666', fontSize: '0.9rem' }}>
                  {slide.content.slice(0, 40)}...
                </p>
              )}
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem' }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect && onSelect(slide, index); 
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  background: '#1976d2',
                  color: 'white',
                  border: 'none',
                  padding: '0.4rem 0.8rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                }}
                aria-label={`Edit slide ${slide.order + 1}`}
              >
                <FaEdit style={{ fontSize: '0.9rem' }} />
                Edit
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete && onDelete(slide.id);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  background: '#d32f2f',
                  color: 'white',
                  border: 'none',
                  padding: '0.4rem 0.8rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                }}
                aria-label={`Delete slide ${slide.order + 1}`}
              >
                <FaTrash style={{ fontSize: '0.9rem' }} />
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SlideList;
