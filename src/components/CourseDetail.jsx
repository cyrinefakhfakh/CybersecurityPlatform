// src/components/CourseDetail.jsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import './CourseDetail.css';

const CourseDetail = ({ courses }) => {
  const { id } = useParams();
  const course = courses.find((course) => course.id === parseInt(id));

  if (!course) {
    return <div className="course-not-found">Course not found</div>;
  }

  return (
    <div className="course-detail-container">
      <Link to="/Courses" className="back-button">← Back</Link>
      <h2>{course.title}</h2>
      <p className="course-description">{course.description}</p>
      
      <div className="course-meta">
        <span className="level">{course.level}</span>
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

      <button className="enroll-button">Enroll Now</button>
    </div>
  );
};

export default CourseDetail;
