import { render, screen } from '@testing-library/react';
import SlideViewer from '../src/components/SlideViewer'; 
import { SlidesContext } from '../src/context/SlidesContext';
import { describe, it, expect } from 'vitest';

describe('SlideViewer', () => {
  it('should render slide content correctly from context', () => {
    const mockSlide = {
      id: 1,
      title: 'Test Slide',
      content: 'Test Content',
      layout: 'default',
    };

    const mockContext = {
      slides: [mockSlide],
      currentIndex: 0,
      loading: false,
      error: null,
      setCurrentIndex: () => {},
      getCurrentSlide: () => mockSlide,
    };

    render(
      <SlidesContext.Provider value={mockContext}>
        <SlideViewer />
      </SlidesContext.Provider>
    );

    expect(screen.getByText('Test Slide')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });
});
