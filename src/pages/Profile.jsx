import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '../components/ProgressBar';
import axios from 'axios';
import './Profile.css'; 

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
      } catch (error) {
        console.error('Error fetching user details:', error);
        setError('Error loading user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!user) {
    return <div>Error loading user data</div>;
  }

  return (
    <div className="profile">
      <h1>Welcome, {user.email || 'User'}</h1>
      <ProgressBar progress={userProgress} />
      <h2>Your Certificates</h2>
      <ul>
        {certificates.map(cert => (
          <li key={cert.id}>{cert.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default Profile;