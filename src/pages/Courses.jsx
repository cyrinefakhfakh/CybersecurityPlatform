import './Courses.css'; // Fichier CSS dédié
import { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';

function Courses() {
  // Exemple de liste de cours
  const [courses] = useState([
    {
      id: 1,
      title: 'Introduction to Cybersecurity',
      description: 'Learn the basics of cybersecurity and how to protect yourself online.',
      level: 'Beginner',
      duration: '4 weeks',
      instructor: { name: 'Jane Doe', expertise: 'Cybersecurity Analyst' },
      enrollmentCount: 2000,
      certificate: true,
      learningOutcomes: [
        'Understand common cybersecurity threats',
        'Learn fundamental security principles',
        'Implement basic protective measures'
      ],
      modules: [
        { name: 'Cybersecurity Basics', description: 'Introduction to cybersecurity concepts.' },
        { name: 'Threat Landscape', description: 'Overview of common threats and attack types.' },
        { name: 'Protection Strategies', description: 'Basic steps to secure personal information.' }
      ]
    },
    {
      id: 2,
      title: 'Network Security Essentials',
      description: 'Understand the fundamentals of securing a network.',
      level: 'Intermediate',
      duration: '6 weeks',
      instructor: { name: 'John Smith', expertise: 'Network Security Engineer' },
      enrollmentCount: 1500,
      certificate: true,
      learningOutcomes: [
        'Learn network security protocols',
        'Identify network vulnerabilities',
        'Implement security measures in network settings'
      ],
      modules: [
        { name: 'Network Fundamentals', description: 'Introduction to network components and architecture.' },
        { name: 'Network Attacks', description: 'Exploring common network vulnerabilities and attacks.' },
        { name: 'Defense Mechanisms', description: 'Implementing firewalls, VPNs, and intrusion detection systems.' }
      ]
    },
    {
      id: 3,
    title: 'Web Application Security Basics',
    description: 'Explore OWASP Top 10 vulnerabilities and learn techniques to secure web applications.',
    level: 'Advanced',
    duration: '8 weeks',
    instructor: { name: 'Alice Johnson', expertise: 'Web Security Specialist' },
    enrollmentCount: 1800,
    certificate: true,
    learningOutcomes: [
      'Understand the OWASP Top 10 vulnerabilities',
      'Learn to identify and mitigate common web application threats',
      'Implement security practices to strengthen web application defenses'
    ],
    modules: [
      { name: 'Introduction to Web Security', description: 'Overview of common threats to web applications.' },
      { name: 'OWASP Top 10', description: 'In-depth exploration of the top vulnerabilities as identified by OWASP.' },
      { name: 'Secure Coding Practices', description: 'Best practices for writing secure web application code.' },
      { name: 'Web Application Firewalls', description: 'Introduction to WAFs and their role in web security.' }
    ]
  },
  {
    id: 4,
    title: 'Penetration Testing Fundamentals',
    description: 'Learn to simulate cyberattacks to assess and improve system security.',
    level: 'Advanced',
    duration: '10 weeks',
    instructor: { name: 'Carlos Martinez', expertise: 'Certified Ethical Hacker' },
    enrollmentCount: 2100,
    certificate: true,
    learningOutcomes: [
      'Understand penetration testing methodologies and tools',
      'Learn ethical hacking techniques for various platforms',
      'Gain practical experience in vulnerability assessment and exploitation'
    ],
    modules: [
      { name: 'Introduction to Penetration Testing', description: 'Overview of pen testing principles and ethics.' },
      { name: 'Reconnaissance and Information Gathering', description: 'Techniques to gather data on target systems.' },
      { name: 'Exploitation', description: 'Simulating attacks to identify and exploit vulnerabilities.' },
      { name: 'Reporting and Remediation', description: 'Documenting findings and recommending security measures.' }
    ]
    },
  ]);
  const navigate = useNavigate();

  const handleStartCourse = (id) => {
    navigate(`/courses/${id}`);
  };

  return (
    <div className="courses-container">
      <p>Explore our cybersecurity training modules and grow your skills!</p>

      <div className="courses-list">
        {courses.map((course) => (
          <div key={course.id} className="course-card">
            <h3>{course.title}</h3>
            <p>{course.description}</p>
            <span className={`level ${course.level.toLowerCase()}`}>{course.level}</span>
            <button className="enroll-button" onClick={() => handleStartCourse(course.id)}>Start Course</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;
