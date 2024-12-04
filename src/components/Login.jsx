// src/components/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';

function Login({ onAuth }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  const navigate = useNavigate();

                const handleLogin = async (e) => {
          e.preventDefault();
          try {
            const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            console.log('Login response:', response.data); // Log the entire response
            localStorage.setItem('token', response.data.token); // Store token
            localStorage.setItem('role', response.data.role); // Store role
            const isAdminUser = response.data.role === 'admin';
            console.log('Role:', response.data.role);
            setMessage('Login successful! Redirecting to homepage...');
            setMessageType('success');
            onAuth(isAdminUser); // Update authentication state
            setTimeout(() => {
              navigate(isAdminUser ? '/admin' : '/'); // Redirect to admin dashboard or homepage
            }, 2000); // Redirect after 2 seconds
          } catch (error) {
            console.error('Login error:', error.response?.data || error.message);
            setMessage(error.response?.data?.message || 'Login failed');
            setMessageType('error');
          }
        };

  return (
    <div className="auth-container">
      <h2>Login to Your Account</h2>
      <form onSubmit={handleLogin}>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="auth-button">Login</button>
      </form>
      {message && (
        <div className={`message ${messageType}`}>
          {message}
        </div>
      )}
      <p>
        Don’t have an account? <Link to="/signup">Sign Up</Link>
      </p>
    </div>
  );
}

export default Login;