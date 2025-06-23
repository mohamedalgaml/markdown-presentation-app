import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SlideEditor from '../src/components/SlideEditor';
import { SlidesContext } from '../src/context/SlidesContext';
import axios from 'axios';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';


vi.mock('axios');

describe('SlideEditor Component', () => {
  const mockUpdateSlide = vi.fn();
  const mockSlide = {
    id: 1,
    title: 'Original Title',
    content: 'Original Content',
    layout: 'default'
  };

  const mockContextValue = {
    updateSlide: mockUpdateSlide,
    slides: [mockSlide],
    currentIndex: 0,
    loading: false,
    error: null,
    getCurrentSlide: () => mockSlide,
  };

  beforeEach(() => {
    mockUpdateSlide.mockClear();
    axios.post.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const renderSlideEditor = (props = {}) => {
    return render(
      <SlidesContext.Provider value={mockContextValue}>
        <SlideEditor 
          slide={mockSlide}
          onSave={mockUpdateSlide}
          onCancel={vi.fn()}
          {...props}
        />
      </SlidesContext.Provider>
    );
  };

  it('should render with initial slide data', () => {
    renderSlideEditor();
    
    expect(screen.getByPlaceholderText(/Slide Title/i).value).toBe('Original Title');
    expect(screen.getByPlaceholderText(/Markdown Content/i).value).toBe('Original Content');
    expect(screen.getByDisplayValue('default')).toBeInTheDocument();
  });

  it('should update fields when user edits them', () => {
    renderSlideEditor();
    
    const titleInput = screen.getByPlaceholderText(/Slide Title/i);
    const contentInput = screen.getByPlaceholderText(/Markdown Content/i);
    const layoutSelect = screen.getByDisplayValue('default');

    fireEvent.change(titleInput, { target: { value: 'Updated Title' } });
    fireEvent.change(contentInput, { target: { value: 'Updated Content' } });
    fireEvent.change(layoutSelect, { target: { value: 'title-only' } });

    expect(titleInput.value).toBe('Updated Title');
    expect(contentInput.value).toBe('Updated Content');
    expect(screen.getByDisplayValue('title-only')).toBeInTheDocument();
  });

  it('should call onSave with updated data when form is submitted', async () => {
    renderSlideEditor();
    
    fireEvent.change(screen.getByPlaceholderText(/Slide Title/i), {
      target: { value: 'Updated Title' }
    });
    fireEvent.click(screen.getByRole('button', { name: /Save Changes/i }));

    await waitFor(() => {
      expect(mockUpdateSlide).toHaveBeenCalledWith(1, {
        id: 1,
        title: 'Updated Title',
        content: 'Original Content',
        layout: 'default',
        imageUrl: ''
      });
    });
  });

  it('should show error when required fields are empty', async () => {
    const mockOnSave = vi.fn();
    renderSlideEditor({ onSave: mockOnSave });
    
    fireEvent.change(screen.getByPlaceholderText(/Slide Title/i), {
      target: { value: '' }
    });
    fireEvent.change(screen.getByPlaceholderText(/Markdown Content/i), {
      target: { value: '' }
    });
    fireEvent.click(screen.getByRole('button', { name: /Save Changes/i }));

    await waitFor(() => {
      expect(screen.getByText(/Please fill in title or content/i)).toBeInTheDocument();
      expect(mockOnSave).not.toHaveBeenCalled();
    });
  });

  it('should call onCancel when cancel button is clicked', () => {
    const mockOnCancel = vi.fn();
    renderSlideEditor({ onCancel: mockOnCancel });
    
    fireEvent.click(screen.getByRole('button', { name: /Cancel/i }));
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  describe('Image Upload Functionality', () => {
    it('should upload image and insert markdown when successful', async () => {
      const mockImageUrl = 'http://test.com/image.png';
      axios.post.mockResolvedValueOnce({ data: { url: mockImageUrl } });
      
      renderSlideEditor();
      
      const file = new File(['test'], 'test.png', { type: 'image/png' });
      const fileInput = screen.getByLabelText(/Upload Image/i);

      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Markdown Content/i).value).toContain(mockImageUrl);
        expect(screen.getByAltText('Uploaded')).toBeInTheDocument();
      });
    });

    it('should show error when image upload fails', async () => {
      axios.post.mockRejectedValueOnce(new Error('Upload failed'));
      
      renderSlideEditor();
      
      const file = new File(['test'], 'test.png', { type: 'image/png' });
      const fileInput = screen.getByLabelText(/Upload Image/i);

      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByText(/Error uploading image/i)).toBeInTheDocument();
      });
    });

    it('should extract and display first image from content', () => {
      const slideWithImage = {
        ...mockSlide,
        content: '![alt text](http://test.com/existing.png)'
      };
      
      renderSlideEditor({ slide: slideWithImage });
      
      expect(screen.getByAltText('Uploaded').src).toBe('http://test.com/existing.png');
    });
  });

  describe('Form Submission States', () => {
    it('should disable save button during submission', async () => {
      mockUpdateSlide.mockImplementationOnce(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );
      
      renderSlideEditor();
      
      const saveButton = screen.getByRole('button', { name: /Save Changes/i });
      fireEvent.click(saveButton);

      expect(saveButton).toBeDisabled();
      
      await waitFor(() => {
        expect(saveButton).not.toBeDisabled();
      });
    });

    it('should handle missing slide ID gracefully', async () => {
      const mockOnSave = vi.fn();
      renderSlideEditor({ 
        slide: { ...mockSlide, id: undefined },
        onSave: mockOnSave
      });
      
      fireEvent.click(screen.getByRole('button', { name: /Save Changes/i }));

      await waitFor(() => {
        expect(screen.getByText(/Slide ID is missing/i)).toBeInTheDocument();
        expect(mockOnSave).not.toHaveBeenCalled();
      });
    });
  });

  describe('Layout Options', () => {
    const layouts = [
      { value: 'default', label: 'Default' },
      { value: 'imageLeft', label: 'Image Left' },
      { value: 'imageRight', label: 'Image Right' },
      { value: 'code', label: 'Code' },
      { value: 'title-only', label: 'Title Only' }
    ];

    layouts.forEach((layout) => {
      it(`should support ${layout.label} layout selection`, () => {
        renderSlideEditor();
        
        const select = screen.getByLabelText(/Layout/i);
        fireEvent.change(select, { target: { value: layout.value } });
        
        expect(select.value).toBe(layout.value);
      });
    });
  });
});