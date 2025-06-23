import React, { useContext, useState, useEffect } from 'react';
import SlideList from './components/SlideList';
import SlideViewer from './components/SlideViewer';
import SlideForm from './components/SlideForm';
import SlideEditor from './components/SlideEditor';
import ProgressBar from './components/ProgressBar';
import { SlidesContext, SlidesProvider } from './context/SlidesContext';
import './App.css';

const AppContent = () => {
  const {
    slides,
    currentIndex,
    setCurrentIndex,
    getCurrentSlide,
    nextSlide,
    prevSlide,
    addSlide,
    updateSlide,
    deleteSlide,
    loading,
    error,
    fetchSlides,
  } = useContext(SlidesContext);

  const [isEditing, setIsEditing] = useState(false);
  const [selectedSlide, setSelectedSlide] = useState(null);
  const [markdownPreview, setMarkdownPreview] = useState(false);
  const currentSlide = getCurrentSlide();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') nextSlide();
      else if (e.key === 'ArrowLeft') prevSlide();
      else if (e.ctrlKey && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        addSlide({
          title: `Slide ${slides.length + 1}`,
          content: '',
          layout: 'default',
          order: slides.length,
        });
      } else if (e.key === 'Delete') {
        const current = getCurrentSlide();
        if (current?.id) deleteSlide(current.id);
      } else if (e.ctrlKey && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        setIsEditing((prev) => !prev);
        setSelectedSlide(currentSlide);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slides.length, currentSlide, addSlide, deleteSlide, getCurrentSlide, nextSlide, prevSlide]);

  const handleSlideAdded = async (newSlide) => {
    try {
      await addSlide(newSlide);
    } catch (error) {
      console.error('Failed to add slide:', error);
      alert('Failed to add slide. Please try again.');
    }
  };

  const handleSlideUpdated = async (slideId, updatedSlide) => {
    try {
      await updateSlide(slideId, updatedSlide);
      await fetchSlides();
      setIsEditing(false);
      setSelectedSlide(null);
    } catch (error) {
      console.error('Failed to update slide:', error);
      alert('Failed to update slide. Please try again.');
    }
  };

  const handleDeleteSlide = async (id) => {
    if (confirm('Are you sure you want to delete this slide?')) {
      try {
        await deleteSlide(id);
        if (selectedSlide?.id === id) {
          setIsEditing(false);
          setSelectedSlide(null);
        }
      } catch (error) {
        console.error('Failed to delete slide:', error);
        alert('Failed to delete slide. Please try again.');
      }
    }
  };

  if (loading && !slides.length) {
    return (
      <div className="app-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading presentation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container">
        <div className="error-message">
          <h3>Error loading slides</h3>
          <p>{error.message}</p>
          <button onClick={fetchSlides} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header>
        <h1 className="app-title">📽️ Markdown Presentation</h1>
        <div className="help-text">
          <span>← →: Navigate</span>
          <span>Ctrl+N: Add</span>
          <span>Delete: Remove</span>
          <span>Ctrl+E: Edit</span>
        </div>
      </header>

      <main>
        <section className="form-section">
          <SlideForm onSlideAdded={handleSlideAdded} />
        </section>

        <section className="slides-section">
          <SlideList
            slides={slides}
            currentIndex={currentIndex}
           onSelect={(slide, index) => {
           const fullSlide = slides.find(s => s.id === slide.id) || slide;
            setSelectedSlide(fullSlide);
           setCurrentIndex(index);
           setIsEditing(true);
           }}
            onDelete={handleDeleteSlide}
          />

          {slides.length > 0 ? (
            <div className="slide-container">
              {isEditing ? (
                <SlideEditor
                  slide={selectedSlide || currentSlide}
                  onSave={handleSlideUpdated}
                  onCancel={() => setIsEditing(false)}
                  markdownPreview={markdownPreview}
                />
              ) : (
                <SlideViewer
                  slide={currentSlide}
                  markdownPreview={markdownPreview}
                />
              )}

              <div className="slide-controls">
                {!isEditing && (
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setSelectedSlide(currentSlide);
                    }}
                    className="control-button edit-button"
                  >
                    Edit Slide (E)
                  </button>
                )}

                <div className="navigation-controls">
                  <button
                    onClick={prevSlide}
                    disabled={currentIndex === 0}
                    className="control-button nav-button"
                  >
                    ◀ Previous (←)
                  </button>

                  <ProgressBar
                    progress={(currentIndex + 1) / slides.length}
                    label={`Slide ${currentIndex + 1} of ${slides.length}`}
                  />

                  <button
                    onClick={nextSlide}
                    disabled={currentIndex === slides.length - 1}
                    className="control-button nav-button"
                  >
                    Next (▶) →
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <p>No slides available. Create your first slide!</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

const App = () => (
  <SlidesProvider>
    <AppContent />
  </SlidesProvider>
);

export default App;
