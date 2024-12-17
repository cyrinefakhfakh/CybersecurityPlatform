import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './Courses.module.css';

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/courses');
        console.log('Fetched courses:', response.data);
        setCourses(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching courses:', error.response?.data || error.message);
        setError('Failed to load courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        Loading...
      </div>
    );
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.coursesContainer}>
      <h1>Courses</h1>
      <div className={styles.coursesList}>
        {courses.map((course) => (
          <div key={course._id} className={styles.courseCard}>
            <div className={`${styles.courseLevel} ${styles[course.level.toLowerCase()]}`}>
              {course.level}
            </div>
            <h3>{course.title}</h3>
            <p>{course.description}</p>
            <p>Instructor: {course.instructor}</p>
            <p>Category: {course.category}</p>
            <p>Price: ${course.price}</p>
            <p>Duration: {course.duration} hours</p>
            <button className={styles.enrollButton}>Enroll Now</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Courses;