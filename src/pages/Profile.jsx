import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '../components/ProgressBar';
import axios from 'axios';
import './Profile.css'; 

function Profile() {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const userProgress = 75; 
  const certificates = [
    { id: 1, name: "Cybersecurity Fundamentals" },
    { id: 2, name: "Web Application Security" },
    { id: 3, name: "Network Security Basics" },
  ];

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/signup'); // Redirect to signup if no token is found
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUser(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user details:', error.message);
        navigate('/signup'); // Redirect to signup on error
      }
    };

    fetchUserDetails();
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile">
      <h2 className="profile-title">Your Profile</h2>
      <div className="user-info">
        
        <p><strong>Email:</strong> {user.email}</p>
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