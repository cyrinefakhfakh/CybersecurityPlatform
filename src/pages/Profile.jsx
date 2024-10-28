import React from 'react';
import ProgressBar from '../components/ProgressBar';
import './Profile.css'; // Importing a CSS file for styles

function Profile() {
  const userProgress = 75; 
  const userName = "Cyrine"; 
  const userEmail = "cyrinefk@gmail.com.com"; 
  const certificates = [
    { id: 1, name: "Cybersecurity Fundamentals" },
    { id: 2, name: "Web Application Security" },
    { id: 3, name: "Network Security Basics" },
  ];

  return (
    <div className="profile">
      <h2 className="profile-title">Your Profile</h2>
      <div className="user-info">
        <p><strong>Name:</strong> {userName}</p>
        <p><strong>Email:</strong> {userEmail}</p>
      </div>
      <p>Track your progress and earn certificates.</p>
      <ProgressBar progress={userProgress} />
      <h3 className="certificates-title">Earned Certificates:</h3>
      <ul className="certificates-list">
        {certificates.map(cert => (
          <li key={cert.id} className="certificate-item">{cert.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default Profile;
