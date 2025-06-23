import React, { useState, useEffect } from 'react';
import { useSlides } from '../context/SlidesContext';
import axios from 'axios';
export default function SlideEditor({ slide, onSave, onCancel }) {
  const { currentSlide } = useSlides();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [layout, setLayout] = useState('default');
  const [imagePreview, setImagePreview] = useState('');
  

  useEffect(() => {
    if (slide) {
      setTitle(slide.title || '');
      setContent(slide.content || '');
      setLayout(slide.layout || 'default');
      setImagePreview(extractFirstImage(slide.content));
    }
  }, [slide]);

  const extractFirstImage = (markdown) => {
    const match = markdown.match(/!\[.*?\]\((.*?)\)/);
    return match ? match[1] : '';
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const imageUrl = response.data.url;
      const markdownImage = `![alt text](${imageUrl})`;
      setContent((prev) => prev + '\n' + markdownImage);
      setImagePreview(imageUrl);
    } catch (error) {
      alert('Error uploading image');
      console.error(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() && !content.trim()) {
      alert('Please fill in title or content.');
      return;
    }
    if (!slide?.id) {
    alert('Slide ID is missing');
    return;
  }

    const updatedSlide = {
      id: slide.id,
      title,
      content,
      layout,
       imageUrl: imagePreview || null,
    };

    onSave(slide.id, updatedSlide);
  };

  if (!slide) return null;

  const styles = {
    form: { marginTop: '1rem' },
    input: {
      width: '100%',
      padding: '0.5rem',
      marginBottom: '0.75rem',
      border: '1px solid #ccc',
      borderRadius: '6px',
      fontSize: '1rem',
    },
    textarea: {
      width: '100%',
      height: '150px',
      padding: '0.5rem',
      border: '1px solid #ccc',
      borderRadius: '6px',
      marginBottom: '0.75rem',
      fontSize: '1rem',
    },
    select: {
      padding: '0.4rem',
      fontSize: '1rem',
      borderRadius: '6px',
      marginBottom: '0.75rem',
    },
    previewImage: {
      maxWidth: '100%',
      borderRadius: '6px',
      marginTop: '0.5rem',
      boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
    },
    buttonGroup: {
      display: 'flex',
      gap: '1rem',
      marginTop: '1rem',
    },
    button: {
      padding: '0.5rem 1rem',
      fontSize: '1rem',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
    },
    saveButton: {
      backgroundColor: '#4a89dc',
      color: '#fff',
    },
    cancelButton: {
      backgroundColor: '#ccc',
      color: '#333',
    },
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h3>Edit Slide</h3>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Slide Title"
        style={styles.input}
      />

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Markdown Content"
        style={styles.textarea}
      />

      <div>
        <label>Layout: </label>
        <select
          value={layout}
          onChange={(e) => setLayout(e.target.value)}
          style={styles.select}
        >
          <option value="default">Default</option>
          <option value="imageLeft">Image Left</option>
          <option value="imageRight">Image Right</option>
          <option value="code">Code</option>
          <option value="title-only">Title Only</option>
        </select>
      </div>

      <div style={{ marginBottom: '0.5rem' }}>
        <label>Upload Image: </label>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
      </div>

      {imagePreview && (
        <div>
          <strong>Preview:</strong>
          <br />
          <img src={imagePreview} alt="Uploaded" style={styles.previewImage} />
        </div>
      )}

      <div style={styles.buttonGroup}>
        <button
          type="submit"
          style={{ ...styles.button, ...styles.saveButton }}
        >
          Save Changes
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            style={{ ...styles.button, ...styles.cancelButton }}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
