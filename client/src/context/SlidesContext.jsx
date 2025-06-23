import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import axios from 'axios';

export const SlidesContext = createContext();
export const useSlides = () => useContext(SlidesContext);

export const SlidesProvider = ({ children }) => {
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE = 'http://localhost:5000/api';

  const api = axios.create({
    baseURL: API_BASE,
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
  });

  const fetchSlides = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/slides');
      setSlides(response.data);

      if (response.data.length === 0) {
        setCurrentIndex(0);
      } else if (currentIndex >= response.data.length) {
        setCurrentIndex(response.data.length - 1);
      }
    } catch (error) {
      console.error('Error fetching slides:', error);
      setError('Failed to load slides. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [currentIndex]);

  useEffect(() => {
    fetchSlides();
  }, [fetchSlides]);

  const addSlide = useCallback(async (newSlide) => {
    setError(null);
    try {
      const response = await api.post('/slides', newSlide);
      const added = response.data;

      setSlides(prev => [...prev, added]);
      setCurrentIndex(prev => prev + 1);

      return added;
    } catch (error) {
      console.error('Error adding slide:', error);
      setError('Failed to add slide. Please try again.');
      throw error;
    }
  }, []);

  const updateSlide = useCallback(async (slideId, updatedSlide) => {
    if (!slideId) {
      console.warn('Missing slide ID. Update aborted.');
      return;
    }

    setError(null);
    try {
      const response = await api.put(`/slides/${slideId}`, updatedSlide);
      const updated = response.data;

      setSlides(prev =>
        prev.map(slide =>
          slide.id === slideId ? updated : slide
        )
      );
      return updated;
    } catch (error) {
      console.error('Error updating slide:', error);
      setError('Failed to update slide. Please try again.');
      throw error;
    }
  }, []);

  const deleteSlide = useCallback(async (slideId) => {
    setError(null);
    try {
      await api.delete(`/slides/${slideId}`);
      setSlides(prev => {
        const filtered = prev.filter(slide => slide.id !== slideId);
        const newIndex = Math.min(currentIndex, filtered.length - 1);
        setCurrentIndex(Math.max(0, newIndex));
        return filtered;
      });
    } catch (error) {
      console.error('Error deleting slide:', error);
      setError('Failed to delete slide. Please try again.');
      throw error;
    }
  }, [currentIndex]);

  const nextSlide = useCallback(() => {
    setCurrentIndex(prev => Math.min(prev + 1, slides.length - 1));
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  }, []);

  const getCurrentSlide = useCallback(() => {
    return slides[currentIndex] || null;
  }, [currentIndex, slides]);

  const contextValue = useMemo(() => ({
    slides,
    currentIndex,
    setCurrentIndex,
    getCurrentSlide,
    loading,
    error,
    addSlide,
    updateSlide,
    deleteSlide,
    nextSlide,
    prevSlide,
    fetchSlides,
    resetError: () => setError(null),
  }), [
    slides,
    currentIndex,
    getCurrentSlide,
    loading,
    error,
    addSlide,
    updateSlide,
    deleteSlide,
    nextSlide,
    prevSlide,
    fetchSlides,
  ]);

  return (
    <SlidesContext.Provider value={contextValue}>
      {children}
    </SlidesContext.Provider>
  );
};
