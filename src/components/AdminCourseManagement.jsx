// src/components/AdminCourseManagement.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminCourseManagement.css';

const AdminCourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    level: '',
    duration: '',
    instructor: '',
    certificate: false,
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/courses');
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error.message);
      }
    };

    fetchCourses();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCourse({ ...newCourse, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setNewCourse({ ...newCourse, [name]: checked });
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/courses', newCourse);
      setCourses([...courses, response.data]);
      setNewCourse({
        title: '',
        description: '',
        level: '',
        duration: '',
        instructor: '',
        certificate: false,
      });
    } catch (error) {
      console.error('Error adding course:', error.message);
    }
  };

  const handleDeleteCourse = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/courses/${id}`);
      setCourses(courses.filter((course) => course.id !== id));
    } catch (error) {
      console.error('Error deleting course:', error.message);
    }
  };

  return (
    <div className="admin-course-management">
      <h2>Admin Course Management</h2>
      <form onSubmit={handleAddCourse}>
        <input
          type="text"
          name="title"
          value={newCourse.title}
          onChange={handleInputChange}
          placeholder="Course Title"
          required
        />
        <textarea
          name="description"
          value={newCourse.description}
          onChange={handleInputChange}
          placeholder="Course Description"
          required
        />
        <input
          type="text"
          name="level"
          value={newCourse.level}
          onChange={handleInputChange}
          placeholder="Course Level"
          required
        />
        <input
          type="text"
          name="duration"
          value={newCourse.duration}
          onChange={handleInputChange}
          placeholder="Course Duration"
          required
        />
        <input
          type="text"
          name="instructor"
          value={newCourse.instructor}
          onChange={handleInputChange}
          placeholder="Instructor Name"
          required
        />
        <label>
          Certificate Available:
          <input
            type="checkbox"
            name="certificate"
            checked={newCourse.certificate}
            onChange={handleCheckboxChange}
          />
        </label>
        <button type="submit">Add Course</button>
      </form>

      <h3>Existing Courses</h3>
      <ul>
        {courses.map((course) => (
          <li key={course.id}>
            <h4>{course.title}</h4>
            <p>{course.description}</p>
            <button onClick={() => handleDeleteCourse(course.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminCourseManagement;