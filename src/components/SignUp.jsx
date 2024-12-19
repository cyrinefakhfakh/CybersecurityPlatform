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
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [emailVerified, setEmailVerified] = useState(false); // New state to track email verification
  
  const navigate = useNavigate();

  const handleSendVerification = async (email) => {
    try {
      await axios.post('http://localhost:5000/api/auth/send-verification', { email });
      setVerificationSent(true);
      setMessage('Verification code sent to your email!');
      setMessageType('success');
    } catch (error) {
      console.error('Error sending verification:', error);
      setMessage('Failed to send verification code');
      setMessageType('error');
    }
  };

  const handleVerifyCode = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/verify-email', {
        email,
        verificationCode,
      });

      if (response.data.message === 'Email verified successfully.') {
        setMessage('Email verified successfully. You can now complete the signup.');
        setMessageType('success');
        setEmailVerified(true); // Update emailVerified state
        setVerificationSent(false); // Disable further verification
      } else {
        setMessage('Invalid or expired verification code.');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setMessage(error.response?.data?.message || 'Verification failed');
      setMessageType('error');
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      setMessageType('error');
      return;
    }

    if (!emailVerified) {
      setMessage('Please verify your email before signing up.');
      setMessageType('info');
      if (!verificationSent) await handleSendVerification(email); // Trigger email verification if not sent
      return;
    }

    setLoading(true);

    try {
      const signupResponse = await axios.post('http://localhost:5000/api/auth/signup', {
        name,
        email,
        password,
      });

      setMessage(signupResponse.data.message);
      setMessageType('success');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Signup failed');
      setMessageType('error');
    } finally {
      setLoading(false);
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

        {verificationSent && !emailVerified && (
          <>
            <label>Verification Code:</label>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Enter code from email"
              required
            />
            <button type="button" onClick={handleVerifyCode}>
              Verify Code
            </button>
          </>
        )}

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
          ) : !emailVerified ? (
            'Send Verification Code'
          ) : (
            'Complete Signup'
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
