import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../src/App';
import { describe, it, expect } from 'vitest';

describe('Integration Test: Add slide flow', () => {
  it('adds a new slide and renders it in the slide list and viewer', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.queryByText(/loading presentation/i)).not.toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText(/enter slide title/i), {
      target: { value: 'My First Slide' },
    });

    fireEvent.change(screen.getByPlaceholderText(/markdown supported/i), {
      target: { value: 'This is a **bold** statement' },
    });

    fireEvent.click(screen.getByRole('button', { name: /create slide/i }));

    await waitFor(() => {
      expect(
        screen.getByText((content, element) =>
          element?.tagName !== 'SCRIPT' &&
          content.toLowerCase().includes('my first slide')
        )
      ).toBeInTheDocument();

      expect(screen.getByText(/bold/i)).toBeInTheDocument();
    });
  });
});
