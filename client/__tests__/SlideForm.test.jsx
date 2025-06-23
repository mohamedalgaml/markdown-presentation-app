import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SlideForm from '../src/components/SlideForm';
import { SlidesContext } from '../src/context/SlidesContext';
import axios from 'axios';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

vi.mock('axios');

describe('SlideForm Component', () => {
  const mockAddSlide = vi.fn();
  const mockContextValue = {
    addSlide: mockAddSlide,
    slides: [],
    currentIndex: 0,
    loading: false,
    error: null,
  };

  beforeEach(() => {
    mockAddSlide.mockClear();
    axios.post.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const renderSlideForm = () => {
    return render(
      <SlidesContext.Provider value={mockContextValue}>
        <SlideForm slideCount={0} />
      </SlidesContext.Provider>
    );
  };

  it('should render all form fields correctly', () => {
    renderSlideForm();

    expect(screen.getByPlaceholderText(/Enter slide title/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter slide content/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Layout/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Upload Image/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create Slide/i })).toBeInTheDocument();
  });

  it('should update form fields when user types', () => {
    renderSlideForm();

    const titleInput = screen.getByPlaceholderText(/Enter slide title/i);
    const contentInput = screen.getByPlaceholderText(/Enter slide content/i);

    fireEvent.change(titleInput, { target: { value: 'Test Title' } });
    fireEvent.change(contentInput, { target: { value: 'Test Content' } });

    expect(titleInput.value).toBe('Test Title');
    expect(contentInput.value).toBe('Test Content');
  });

  it('should call addSlide with correct data when form is submitted', async () => {
    renderSlideForm();

    fireEvent.change(screen.getByPlaceholderText(/Enter slide title/i), {
      target: { value: 'Test Title' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter slide content/i), {
      target: { value: 'Test Content' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Create Slide/i }));

    await waitFor(() => {
      expect(mockAddSlide).toHaveBeenCalledWith({
        title: 'Test Title',
        content: 'Test Content',
        layout: 'default',
        order: 0,
      });
    });
  });

  it('should show error message when addSlide fails', async () => {
    const errorMessage = 'Failed to create slide';
    mockAddSlide.mockRejectedValueOnce(new Error(errorMessage));

    renderSlideForm();

    fireEvent.change(screen.getByPlaceholderText(/Enter slide title/i), {
      target: { value: 'Test Title' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Create Slide/i }));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  describe('Image Upload Functionality', () => {
    it('should accept valid image files', async () => {
      renderSlideForm();

      const file = new File(['test'], 'test.png', { type: 'image/png' });
      const fileInput = screen.getByLabelText(/Upload Image/i);

      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByText(/Selected: test.png/i)).toBeInTheDocument();
      });
    });

    it('should reject invalid file types', async () => {
      renderSlideForm();

      const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
      const fileInput = screen.getByLabelText(/Upload Image/i);

      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByText(/Only JPEG, PNG or GIF images are allowed/i)).toBeInTheDocument();
      });
    });

    it('should reject files larger than 5MB', async () => {
      renderSlideForm();

      
      const largeFile = new File([new ArrayBuffer(5 * 1024 * 1024 + 1)], 'large.png', {
        type: 'image/png',
      });
      const fileInput = screen.getByLabelText(/Upload Image/i);

      fireEvent.change(fileInput, { target: { files: [largeFile] } });

      await waitFor(() => {
        expect(screen.getByText(/File size must be less than 5MB/i)).toBeInTheDocument();
      });
    });

    it('should insert image markdown when upload succeeds', async () => {
      const mockImageUrl = 'http://test.com/image.png';
      axios.post.mockResolvedValueOnce({ data: { url: mockImageUrl } });

      renderSlideForm();

      const file = new File(['test'], 'test.png', { type: 'image/png' });
      const fileInput = screen.getByLabelText(/Upload Image/i);

      fireEvent.change(fileInput, { target: { files: [file] } });
      fireEvent.click(screen.getByText(/Insert Image into Content/i));

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Enter slide content/i).value).toContain(mockImageUrl);
        expect(axios.post).toHaveBeenCalledTimes(1);
      });
    });

    it('should show error when image upload fails', async () => {
      axios.post.mockRejectedValueOnce(new Error('Upload failed'));

      renderSlideForm();

      const file = new File(['test'], 'test.png', { type: 'image/png' });
      const fileInput = screen.getByLabelText(/Upload Image/i);

      fireEvent.change(fileInput, { target: { files: [file] } });
      fireEvent.click(screen.getByText(/Insert Image into Content/i));

      await waitFor(() => {
        expect(screen.getByText(/Image upload failed/i)).toBeInTheDocument();
      });
    });
  });

  describe('Form Validation', () => {
    it('should allow submission with only title', async () => {
      renderSlideForm();

      fireEvent.change(screen.getByPlaceholderText(/Enter slide title/i), {
        target: { value: 'Title Only' },
      });
      fireEvent.click(screen.getByRole('button', { name: /Create Slide/i }));

      await waitFor(() => {
        expect(mockAddSlide).toHaveBeenCalled();
      });
    });

    it('should allow submission with only content', async () => {
      renderSlideForm();

      fireEvent.change(screen.getByPlaceholderText(/Enter slide content/i), {
        target: { value: 'Content Only' },
      });
      fireEvent.click(screen.getByRole('button', { name: /Create Slide/i }));

      await waitFor(() => {
        expect(mockAddSlide).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'Slide 1', 
            content: 'Content Only',
          })
        );
      });
    });

    it('should disable submit button during submission', async () => {
      mockAddSlide.mockImplementationOnce(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

      renderSlideForm();

      const submitButton = screen.getByRole('button', { name: /Create Slide/i });
      fireEvent.click(submitButton);

      expect(submitButton).toBeDisabled();
      expect(submitButton.textContent).toContain('Creating Slide...');

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });
    });
  });
});