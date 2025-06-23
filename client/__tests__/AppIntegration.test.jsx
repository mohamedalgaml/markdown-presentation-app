import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../src/App';
import { SlidesContext } from '../src/context/SlidesContext';
import { vi, describe, it, expect } from 'vitest';

describe('Slide Update Process', () => {
  it('should successfully update a slide through UI interaction', async () => {
    const mockUpdateSlide = vi.fn().mockResolvedValue({
      id: 1,
      title: 'Updated Slide',
      content: 'Updated Content',
      layout: 'imageLeft'
    });

    const mockSlide = {
      id: 1,
      title: 'Original Slide',
      content: 'Original Content',
      layout: 'default'
    };

    render(
      <SlidesContext.Provider value={{
        slides: [mockSlide],
        currentIndex: 0,
        updateSlide: mockUpdateSlide,
        getCurrentSlide: () => mockSlide,
        loading: false,
        error: null,
        setCurrentIndex: () => {},
        nextSlide: () => {},
        prevSlide: () => {},
        deleteSlide: () => {},
        addSlide: () => {},
        refreshSlides: () => {}
      }}>
        <App />
      </SlidesContext.Provider>
    );

    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: /edit/i }));

    await user.clear(screen.getByPlaceholderText(/slide title/i));
    await user.type(screen.getByPlaceholderText(/slide title/i), 'Updated Slide');

    await user.clear(screen.getByPlaceholderText(/markdown content/i));
    await user.type(screen.getByPlaceholderText(/markdown content/i), 'Updated Content');

    await user.selectOptions(
      screen.getByLabelText(/layout/i),
      'imageLeft'
    );

    await user.click(screen.getByRole('button', { name: /save changes/i }));

    await waitFor(() => {
      expect(mockUpdateSlide).toHaveBeenCalledWith(
        1,
        expect.objectContaining({
          title: 'Updated Slide',
          content: 'Updated Content',
          layout: 'imageLeft',
        })
      );
    });
  });
});
