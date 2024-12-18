import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './AddCourse.module.css';
function AddCourse() {
  const navigate = useNavigate();
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    instructor: '',
    category: '',
    price: '',
    duration: '',
    level: 'Beginner',
    published: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const categories = [
    'Web Development',
    'Data Science',
    'Machine Learning',
    'Mobile Development',
    'Cybersecurity',
    'Cloud Computing',
    'Other',
  ];
  const levels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCourseData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!courseData.title.trim()) newErrors.title = 'Course title is required';
    if (!courseData.description.trim())
      newErrors.description = 'Course description is required';
    if (!courseData.instructor.trim())
      newErrors.instructor = 'Instructor name is required';
    if (!courseData.category)
      newErrors.category = 'Please select a category';
    if (!courseData.price || isNaN(parseFloat(courseData.price)))
      newErrors.price = 'Valid price is required';
    if (!courseData.duration || isNaN(parseInt(courseData.duration)))
      newErrors.duration = 'Valid duration is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/courses/add', courseData);
      setMessage('Course added successfully!');
      setMessageType('success');
      // Reset form fields
      setCourseData({
        title: '',
        description: '',
        instructor: '',
        category: '',
        price: '',
        duration: '',
        level: '',
        published: false,
      });
    } catch (error) {
      console.error('Error adding course:', error.response?.data || error.message);
      setMessage(error.response?.data?.message || 'Failed to add course');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>Add New Course</div>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Course Title</label>
          <input
            type="text"
            name="title"
            value={courseData.title}
            onChange={handleChange}
            className={styles.input}
            placeholder="Enter course title"
            required
          />
          {errors.title && <p className={styles.error}>{errors.title}</p>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Description</label>
          <textarea
            name="description"
            value={courseData.description}
            onChange={handleChange}
            className={`${styles.input} ${styles.textarea}`}
            placeholder="Describe the course"
            required
          />
          {errors.description && <p className={styles.error}>{errors.description}</p>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Instructor</label>
          <input
            type="text"
            name="instructor"
            value={courseData.instructor}
            onChange={handleChange}
            className={styles.input}
            placeholder="Enter instructor name"
            required
          />
          {errors.instructor && <p className={styles.error}>{errors.instructor}</p>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Category</label>
          <select
            name="category"
            value={courseData.category}
            onChange={handleChange}
            className={styles.input}
            required
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && <p className={styles.error}>{errors.category}</p>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Price ($)</label>
          <input
            type="number"
            name="price"
            value={courseData.price}
            onChange={handleChange}
            className={styles.input}
            placeholder="Enter course price"
            required
            min="0"
          />
          {errors.price && <p className={styles.error}>{errors.price}</p>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Duration (hours)</label>
          <input
            type="number"
            name="duration"
            value={courseData.duration}
            onChange={handleChange}
            className={styles.input}
            placeholder="Enter duration"
            required
            min="1"
          />
          {errors.duration && <p className={styles.error}>{errors.duration}</p>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Level</label>
          <select
            name="level"
            value={courseData.level}
            onChange={handleChange}
            className={styles.input}
          >
            {levels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.checkbox}>
          <input
            type="checkbox"
            name="published"
            checked={courseData.published}
            onChange={handleChange}
          />
          <label>Publish Course Immediately</label>
        </div>
        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? 'Creating...' : 'Add Course'}
        </button>
      </form>
      {message && (
        <div className={`${styles.message} ${styles[messageType]}`}>
          {message}
        </div>
      )}
    </div>
  );
}
export default AddCourse;
