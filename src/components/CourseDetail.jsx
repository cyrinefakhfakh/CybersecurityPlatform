import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './CourseDetail.css';

const CourseDetail = ({ courses }) => {
  const { id } = useParams();
  const course = courses.find((course) => course.id === parseInt(id));
  const [showModal, setShowModal] = useState(false);

  if (!course) {
    return <div className="course-not-found">Course not found</div>;
  }

  const handleEnrollClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="course-detail-container">
      <Link to="/courses" className="back-button">← Back</Link>
      <h2>{course.title}</h2>
      <p className="course-description">{course.description}</p>
      
      <div className="course-meta">
        <span className={`level ${course.level.toLowerCase()}`}>{course.level}</span>
        <p><strong>Duration:</strong> {course.duration}</p>
        <p><strong>Instructor:</strong> {course.instructor.name} - {course.instructor.expertise}</p>
        <p><strong>Enrolled Students:</strong> {course.enrollmentCount}</p>
        {course.certificate && <p className="certificate">Certificate Available</p>}
      </div>
      
      <h3>What You Will Learn</h3>
      <ul className="learning-outcomes">
        {course.learningOutcomes.map((outcome, index) => (
          <li key={index}>{outcome}</li>
        ))}
      </ul>

      <h3>Course Modules</h3>
      <ul className="modules-list">
        {course.modules.map((module, index) => (
          <li key={index}>
            <h4>{module.name}</h4>
            <p>{module.description}</p>
          </li>
        ))}
      </ul>

      <button className="enroll-button" onClick={handleEnrollClick}>Enroll Now</button>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={handleCloseModal}>&times;</span>
            <h2>Payment Options</h2>
            <p>Select a payment method to enroll in the course:</p>
            <button className="payment-button">Credit Card</button>
            <button className="payment-button">PayPal</button>
            <button className="payment-button">Bank Transfer</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetail;