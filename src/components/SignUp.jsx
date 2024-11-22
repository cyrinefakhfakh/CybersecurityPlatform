import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';

function SignUp({ onAuth }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); 
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      setMessageType('error');
      return;
    }
    setLoading(true); 
    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', { name, email, password });
      console.log('User signed up:', response.data);
      setMessage('Sign up successful! Please log in.');
      setMessageType('success');
      onAuth(); // Update authentication state
      setTimeout(() => {
        setLoading(false); // Reset loading state
        navigate('/login'); // Redirect to login page after signup
      }, 2000); // Redirect after 2 seconds
    } catch (error) {
      console.error('Signup error:', error.response?.data || error.message);
      setMessage(error.response?.data?.message || 'Signup failed');
      setMessageType('error');
      setLoading(false); // Reset loading state on error
    }
  };

  return (
    <div className="auth-container">
      <h2>Create a New Account</h2>
      <form onSubmit={handleSignUp}>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

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

        <label>Confirm Password:</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className={`auth-button ${loading ? 'loading' : ''}`}
          disabled={loading}
        >
          {loading ? (
            <>
              Signing Up...
              <span className="spinner"></span>
            </>
          ) : (
            'Sign Up'
          )}
        </button>
      </form>
      {message && (
        <div className={`message ${messageType}`}>
          {message}
        </div>
      )}
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

export default SignUp;
