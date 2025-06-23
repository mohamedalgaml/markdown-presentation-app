import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import App from '../src/App';
import { SlidesContext } from '../src/context/SlidesContext';
import { vi, describe, it, expect } from 'vitest';

describe('Slide Deletion', () => {
it('should delete a slide successfully', async () => {
const mockDeleteSlide = vi.fn().mockResolvedValue({});
const mockSlide = {
id: 1,
title: 'Slide to delete',
content: 'Content to delete',
layout: 'default',
};

const contextValue = {
slides: [mockSlide],
currentIndex: 0,
setCurrentIndex: vi.fn(),
deleteSlide: mockDeleteSlide,
loading: false,
error: null,
getCurrentSlide: () => mockSlide,
updateSlide: vi.fn(),
fetchSlides: vi.fn(),
addSlide: vi.fn(),
};

render(
<SlidesContext.Provider value={contextValue}>
  <App />
</SlidesContext.Provider>
);
const slideItem = await screen.findByTestId(`slide-item-${mockSlide.id}`);
expect(slideItem).toBeInTheDocument();
const deleteButton = within(slideItem).getByRole('button', { name: /delete/i });
fireEvent.click(deleteButton);
await waitFor(() => {
expect(mockDeleteSlide).toHaveBeenCalledWith(mockSlide.id);
});
});
});
