import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../src/App';
import { describe, it, expect } from 'vitest';

describe('App keyboard navigation', () => {
  it('navigates slides using arrow keys', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText(/enter slide title/i), {
      target: { value: 'Slide 1' },
    });
    fireEvent.change(screen.getByPlaceholderText(/markdown supported/i), {
      target: { value: 'Slide content 1' },
    });
    fireEvent.click(screen.getByRole('button', { name: /create slide/i }));
    fireEvent.change(screen.getByPlaceholderText(/enter slide title/i), {
      target: { value: 'Slide 2' },
    });
    fireEvent.change(screen.getByPlaceholderText(/markdown supported/i), {
      target: { value: 'Slide content 2' },
    });
    fireEvent.click(screen.getByRole('button', { name: /create slide/i }));
    await waitFor(() =>
      expect(screen.getByText(/slide content 2/i)).toBeInTheDocument()
    );
    fireEvent.keyDown(document, { key: 'ArrowLeft' });

    await waitFor(() =>
      expect(screen.getByText(/slide content 1/i)).toBeInTheDocument()
    );
  });
});
