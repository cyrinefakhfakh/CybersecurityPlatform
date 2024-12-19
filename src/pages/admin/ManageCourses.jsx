import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styles from './ManageCourses.module.css';

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/courses');
        console.log('Fetched courses:', response.data);
        setCourses(response.data);
      } catch (err) {
        setError('Failed to fetch courses. Please try again later.');
        console.error('Error fetching courses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleDeleteCourse = async (id) => {
    if (!id) {
      setError('Invalid course ID provided.');
      return;
    }
  
    try {
      console.log('Attempting to delete course with ID:', id);
      
      const response = await axios.delete(`http://localhost:5000/api/courses/${id}`, {
        timeout: 5000,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.status === 200) {
        console.log('Delete successful:', response.data);
        setCourses(courses.filter(course => course._id !== id));
        setError('');
        setShowDeleteModal(false);
        setCourseToDelete(null);  // Clear the courseToDelete state
      }
    } catch (error) {
      console.error('Delete request failed:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
  
      const errorMessage = error.response?.data?.details || 
                          error.response?.data?.message || 
                          'Failed to delete the course. Please try again later.';
      
      setError(errorMessage);
    }
  };
  const handleDelete = () => {
    if (courseToDelete && courseToDelete._id) {
      handleDeleteCourse(courseToDelete._id);
    } else {
      setError('No course selected for deletion.');
    }
  };
  // Filter courses based on search term
  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // DeleteModal component
  const DeleteModal = () => (
    <div className={styles.modalBackdrop}>
      <div 
        className={styles.modal} 
        role="dialog" 
        aria-modal="true" 
        aria-labelledby="modal-title"
      >
        <h2 id="modal-title">Confirm Deletion</h2>
        <p>Are you sure you want to delete "{courseToDelete?.title}"?</p>
        <div className={styles.modalButtons}>
          <button
            className={styles.cancelButton}
            onClick={() => {
              setShowDeleteModal(false);
              setCourseToDelete(null);
            }}
          >
            Cancel
          </button>
          <button
            className={styles.deleteButton}
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Manage Courses</h1>
        <Link to="/admin/courses/add" className={styles.addButton}>
          Add New Course
        </Link>
      </div>

      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {loading ? (
        <div className={styles.message}>Loading courses...</div>
      ) : error ? (
        <div className={styles.error}>{error}</div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Course Title</th>
                <th>Instructor</th>
                <th>Category</th>
                <th>Level</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.map((course, index) => (
                <tr key={course._id || index}>
                  <td>{course.title}</td>
                  <td>{course.instructor}</td>
                  <td>{course.category}</td>
                  <td>{course.level}</td>
                  <td>${course.price}</td>
                  <td>
                    <span className={course.published ? styles.published : styles.draft}>
                      {course.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td>
                    <Link 
                      to={`/admin/courses/edit/${course._id}`} 
                      className={styles.editButton}
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => {
                        setCourseToDelete(course);
                        setShowDeleteModal(true);
                      }}
                      className={styles.deleteButton}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showDeleteModal && <DeleteModal />}
    </div>
  );
};

export default ManageCourses;