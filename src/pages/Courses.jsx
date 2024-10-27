import './Courses.css'; // Fichier CSS dédié
import { useState } from 'react'; 

function Courses() {
  // Exemple de liste de cours
  const [courses] = useState([
    {
      id: 1,
      title: 'Introduction to Cybersecurity',
      description: 'Learn the basics of cybersecurity and common threats.',
      level: 'Beginner',
    },
    {
      id: 2,
      title: 'Network Security Essentials',
      description: 'Understand network vulnerabilities and how to secure them.',
      level: 'Intermediate',
    },
    {
      id: 3,
      title: 'Web Application Security',
      description: 'Explore OWASP Top 10 vulnerabilities and mitigation techniques.',
      level: 'Advanced',
    },
    {
      id: 4,
      title: 'Penetration Testing Fundamentals',
      description: 'Learn how to simulate cyberattacks to identify weaknesses.',
      level: 'Advanced',
    },
  ]);

  return (
    <div className="courses-container">
      <h1>Our Courses</h1>
      <p>Explore our cybersecurity training modules and grow your skills!</p>

      <div className="courses-list">
        {courses.map((course) => (
          <div key={course.id} className="course-card">
            <h3>{course.title}</h3>
            <p>{course.description}</p>
            <span className={`level ${course.level.toLowerCase()}`}>{course.level}</span>
            <button className="enroll-button">Start Course</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Courses;
