import React, { useState, useRef } from 'react';
import { useSlides } from '../context/SlidesContext';
import axios from 'axios';

const SlideForm = ({ slideCount }) => {
const { addSlide } = useSlides();

const [formData, setFormData] = useState({
title: '',
content: '',
layout: 'default'
});
const [imageFile, setImageFile] = useState(null);
const [uploadStatus, setUploadStatus] = useState('idle');
const [errorMessage, setErrorMessage] = useState('');
const fileInputRef = useRef(null);
const textareaRef = useRef(null);

const handleInputChange = (e) => {
const { name, value } = e.target;
setFormData(prev => ({
...prev,
[name]: value
}));
};

const handleImageChange = (e) => {
const file = e.target.files[0];
if (!file) return;

const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
if (!allowedTypes.includes(file.type)) {
setErrorMessage('Only JPEG, PNG or GIF images are allowed');
return;
}

if (file.size > 5 * 1024 * 1024) {
setErrorMessage('File size must be less than 5MB');
return;
}

setImageFile(file);
setErrorMessage('');
};

const insertImageMarkdown = async () => {
if (!imageFile) {
setErrorMessage('Please select an image first');
return;
}

try {
const uploadForm = new FormData();
uploadForm.append('file', imageFile);

const uploadResponse = await axios.post('http://localhost:5000/api/upload', uploadForm, {
headers: { 'Content-Type': 'multipart/form-data' }
});

const imageUrl = uploadResponse.data.url;
const altText = imageFile.name.replace(/\.[^/.]+$/, '').replace(/\s+/g, '-');
const markdownImage = `![${altText}](${encodeURI(imageUrl)})`;

const textarea = textareaRef.current;
const start = textarea.selectionStart;
const end = textarea.selectionEnd;
const newText =
formData.content.slice(0, start) +
markdownImage +
formData.content.slice(end);

setFormData(prev => ({
...prev,
content: newText
}));

setImageFile(null);
if (fileInputRef.current) fileInputRef.current.value = '';
} catch (error) {
console.error('Image upload failed', error);
setErrorMessage('Image upload failed');
}
};

const handleSubmit = async (e) => {
e.preventDefault();
setUploadStatus('uploading');
setErrorMessage('');

try {
const newSlide = {
title: formData.title || `Slide ${slideCount + 1}`,
content: formData.content,
layout: formData.layout,
order: slideCount
};

await addSlide(newSlide);

setFormData({ title: '', content: '', layout: 'default' });
setImageFile(null);
if (fileInputRef.current) fileInputRef.current.value = '';
setUploadStatus('success');
} catch (error) {
setUploadStatus('error');
let errorMsg = 'Submission failed';

if (error.response) {
errorMsg = error.response.data.error || 'Server error occurred';
} else if (error.request) {
errorMsg = 'No response from server. Check your connection.';
} else {
errorMsg = error.message;
}

setErrorMessage(errorMsg);
console.error('Submission error:', error);
}
};

return (
<form onSubmit={handleSubmit} className="slide-form">
<div className="form-group">
<label htmlFor="title">Slide Title</label>
<input
type="text"
id="title"
name="title"
value={formData.title}
onChange={handleInputChange}
placeholder="Enter slide title"
/>
</div>

<div className="form-group">
<label htmlFor="content">Content</label>
<textarea
id="content"
name="content"
ref={textareaRef}
value={formData.content}
onChange={handleInputChange}
placeholder="Enter slide content (Markdown supported)"
rows="4"
/>
</div>

<div className="form-group">
<label htmlFor="layout">Layout</label>
<select
id="layout"
name="layout"
value={formData.layout}
onChange={handleInputChange}
>
<option value="default">Default</option>
<option value="title-only">Title Only</option>
<option value="image-focused">Image Focused</option>
</select>
</div>

<div className="form-group">
<label htmlFor="image">Upload Image (Optional)</label>
<input
type="file"
id="image"
ref={fileInputRef}
onChange={handleImageChange}
accept="image/jpeg, image/png, image/gif"
/>
{imageFile && (
<div className="image-preview">
<p>Selected: {imageFile.name}</p>
<button type="button" className="insert-image-button" onClick={insertImageMarkdown}>
📸 Insert Image into Content
</button>
</div>
)}
</div>

{errorMessage && <div className="error-message">{errorMessage}</div>}
{uploadStatus === 'success' && <div className="success-message">Slide created successfully!</div>}

<button type="submit" className="submit-button" disabled={uploadStatus === 'uploading'}>
{uploadStatus === 'uploading' ? 'Creating Slide...' : 'Create Slide'}
</button>
</form>
);
};

export default SlideForm;
