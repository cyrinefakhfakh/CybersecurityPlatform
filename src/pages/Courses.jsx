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
  const refreshToken = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/refresh-token', {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('refreshToken')}`
        }
      });
      localStorage.setItem('token', response.data.token);
      return response.data.token;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      alert('Session expired. Please log in again.');
      return null;
    }
  };
  const handleEnrollNowClick = async (course) => {
    let token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to enroll in a course');
      return;
    }
  
    try {
      const response = await axios.post(
        'http://localhost:5000/api/enroll', 
        { 
          courseId: course._id || course.id 
        }, 
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          // Add timeout and error handling
          timeout: 10000  // 10 seconds timeout
        }
      );
  
      if (response.data.success) {
        // Update UI to show enrollment
        setCourses(prevCourses => 
          prevCourses.map(c => 
            c.id === course.id 
              ? { ...c, isEnrolled: true } 
              : c
          )
        );
        
        alert('Successfully enrolled in the course!');
        openEnrollmentSuccessModal(course);
      }
    } catch (error) {
      if (error.response?.status === 401 && error.response?.data?.message === 'jwt expired') {
        token = await refreshToken();
        if (token) {
          handleEnrollNowClick(course);
        }
      } else {
        console.error('ENROLLMENT AXIOS ERROR:', {
          response: error.response?.data,
          status: error.response?.status,
          message: error.message
        });

        const errorMessage = 
          error.response?.data?.message || 
          error.message || 
          'Failed to enroll in the course';
        
        alert(errorMessage);
      }
    }
  };
  const openEnrollmentSuccessModal = (course) => {
    alert(`Successfully enrolled in ${course.title}!`);
    sendVerificationEmail(course);
  };

  const sendVerificationEmail = async (course) => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');
  
    if (!token || !email) {
      alert('Authentication expired. Please log in again.');
      return;
    }
  
    try {
      const response = await axios.post(
        'http://localhost:5000/api/send-verification-email',
        { email, courseTitle: course.title }, // Include course title in the request body
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      alert('Verification email sent successfully.');
    } catch (error) {
      alert('Failed to send verification email.');
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