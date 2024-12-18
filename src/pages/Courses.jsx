import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Courses.module.css';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [expandedCourses, setExpandedCourses] = useState({});

  useEffect(() => {
    let isMounted = true;
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/courses');
        if (isMounted) {
          // Add a unique identifier if not present
          const coursesWithIds = response.data.map((course, index) => ({
            ...course,
            id: course.id || `course-${index}`
          }));
          setCourses(coursesWithIds);
          setLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          setError('Failed to fetch courses');
          setLoading(false);
        }
      }
    };

    fetchCourses();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleEnrollNowClick = async (course) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to enroll in a course.');
      return;
    }
  
    try {
      console.log('Enrollment Token:', token);
      console.log('Course ID:', course._id || course.id);
  
      const { data } = await axios.post(
        'http://localhost:5000/api/enroll',
        { courseId: course._id || course.id },
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );
  
      // Rest of the enrollment logic...
    } catch (error) {
      console.error('Detailed Enrollment Error:', {
        response: error.response?.data,
        message: error.message,
        status: error.response?.status
      });
      
      alert(error.response?.data?.message || 'Failed to enroll in course.');
    }
  };

  const openEnrollmentSuccessModal = (course) => {
    alert(`Successfully enrolled in ${course.title}!`);
    sendVerificationEmail();
  };

  const sendVerificationEmail = async () => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');

    if (!token || !email) {
      alert('User authentication details are missing. Please log in again.');
      return;
    }

    try {
      await axios.post(
        'http://localhost:5000/api/send-verification-email',
        { email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('A verification email has been sent to your email address.');
    } catch (error) {
      alert('Failed to send verification email. Please try again later.');
    }
  };

  const toggleMoreDetails = (courseId) => {
    setExpandedCourses((prev) => ({
      ...prev,
      [courseId]: !prev[courseId],
    }));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={styles.courses}>
      {selectedCourse ? (
        <div className={styles.courseDetails}>
          <h2>{selectedCourse.title}</h2>
          <p>{selectedCourse.description}</p>
          <p><strong>Instructor:</strong> {selectedCourse.instructor}</p>
          <p><strong>Duration:</strong> {selectedCourse.duration}</p>
          <p><strong>Price:</strong> {selectedCourse.price}</p>
          <p><strong>Level:</strong> {selectedCourse.level}</p>
          <button onClick={() => setSelectedCourse(null)}>Back to Courses</button>
        </div>
      ) : (
        courses.map((course) => (
          <div 
            className={styles.course} 
            key={course.id} 
            // Fallback to index if for some reason id is not unique
          >
            <h3>{course.title}</h3>
            <p>Level: {course.level}</p>
            {expandedCourses[course.id] && (
              <>
                <p>{course.description}</p>
                <p>Instructor: {course.instructor}</p>
                <p>Duration: {course.duration}</p>
                <p>Price: {course.price}</p>
              </>
            )}
            <button onClick={() => toggleMoreDetails(course.id)}>
              {expandedCourses[course.id] ? 'Show Less' : 'More Details'}
            </button>
            {course.isEnrolled ? (
              <p className={styles.enrolled}>You are enrolled in this course</p>
            ) : (
              <button onClick={() => handleEnrollNowClick(course)}>Enroll Now</button>
            )}
          </div>
        ))
      )}
    </div>
  );
};
export default Courses;