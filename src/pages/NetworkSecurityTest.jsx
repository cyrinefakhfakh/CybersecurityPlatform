import React, { useState, useEffect } from 'react';
import './NetworkSecurityTest.css';

const NetworkSecurityTest = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isGeneratingCertificate, setIsGeneratingCertificate] = useState(false);
  const [certificateError, setCertificateError] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const validateEmail = (email) => {
    return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };
  const handleTestCompletion = async () => {
    const percentage = ((score / questions.length) * 100);
    if (percentage < 70) return;
  
    if (!validateEmail(userEmail)) {
      setCertificateError('Please enter a valid email address');
      return;
    }
  
    setIsGeneratingCertificate(true);
    setCertificateError(null);
  
    try {
      let response = await fetch(`${API_BASE_URL}/api/generate-certificate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          courseName: 'Network Security Basics',
          grade: percentage.toFixed(1),
          email: userEmail
        })
      });
  
      // Handle different response status codes
      if (response.status === 401) {
        // Token expired, try to refresh it
        const refreshResponse = await fetch(`${API_BASE_URL}/api/auth/refresh-token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            refreshToken: localStorage.getItem('refreshToken')
          })
        });
  
        if (!refreshResponse.ok) {
          throw new Error('Your session has expired. Please log in again.');
        }
  
        const refreshData = await refreshResponse.json();
        localStorage.setItem('token', refreshData.token);
  
        // Retry the original request with new token
        response = await fetch(`${API_BASE_URL}/api/generate-certificate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${refreshData.token}`
          },
          body: JSON.stringify({
            courseName: 'Network Security Basics',
            grade: percentage.toFixed(1),
            email: userEmail
          })
        });
      }
  
      const data = await response.json();
  
      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 400) {
          throw new Error(data.message || 'Please check your email address and try again.');
        } else if (response.status === 404) {
          throw new Error('User account not found. Please log in again.');
        } else if (response.status === 500) {
          throw new Error('Server error: ' + (data.error || 'Failed to generate certificate'));
        } else {
          throw new Error(data.message || 'Failed to generate certificate');
        }
      }
  
      alert('Certificate has been generated and sent to your email!');
    } catch (error) {
      console.error('Error generating certificate:', error);
      setCertificateError(error.message || 'Failed to generate certificate. Please try again.');
    } finally {
      setIsGeneratingCertificate(false);
    }
  };


  const questions = [
    {
      question: "What is the primary purpose of a firewall?",
      options: [
        "To monitor network traffic and block unauthorized access",
        "To speed up internet connection",
        "To store network data",
        "To encrypt emails"
      ],
      correctAnswer: 0
    },
    {
      question: "Which of the following is NOT a common network attack?",
      options: [
        "Phishing",
        "Network Compression",
        "DDoS",
        "Man-in-the-Middle"
      ],
      correctAnswer: 1
    },
    {
      question: "What does SSL stand for?",
      options: [
        "System Security Layer",
        "Secure Socket Layer",
        "Secure System Link",
        "Socket Security Link"
      ],
      correctAnswer: 1
    },
    {
      question: "Which protocol is used to securely access a remote server?",
      options: [
        "HTTP",
        "FTP",
        "SSH",
        "SMTP"
      ],
      correctAnswer: 2
    },
    {
      question: "What is a VPN primarily used for?",
      options: [
        "Increasing internet speed",
        "Storing passwords",
        "Creating secure connections over public networks",
        "Managing email servers"
      ],
      correctAnswer: 2
    },
    {
      question: "Which encryption method is considered more secure?",
      options: [
        "Symmetric encryption",
        "Asymmetric encryption",
        "Basic encryption",
        "Single-key encryption"
      ],
      correctAnswer: 1
    },
    {
      question: "What is the purpose of network segmentation?",
      options: [
        "To increase network speed",
        "To reduce security risks by isolating parts of the network",
        "To save bandwidth",
        "To store backup data"
      ],
      correctAnswer: 1
    },
    {
      question: "What is the main function of an IDS (Intrusion Detection System)?",
      options: [
        "To block all network traffic",
        "To monitor and alert about suspicious activities",
        "To encrypt network traffic",
        "To manage user passwords"
      ],
      correctAnswer: 1
    },
    {
      question: "What is port scanning used for?",
      options: [
        "To speed up network connections",
        "To identify open ports and potential vulnerabilities",
        "To encrypt data transmission",
        "To manage user accounts"
      ],
      correctAnswer: 1
    },
    {
      question: "Which of these is a best practice for password security?",
      options: [
        "Using the same password for all accounts",
        "Writing passwords down on paper",
        "Using complex passwords with special characters",
        "Sharing passwords with team members"
      ],
      correctAnswer: 2
    }
  ];

  useEffect(() => {
    let timer;
    if (isTestStarted && timeLeft > 0 && !showResults) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setShowResults(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTestStarted, timeLeft, showResults]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleStartTest = () => {
    setIsTestStarted(true);
  };

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
    
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      setShowResults(true);
    }
  };

  const getGrade = (percentage) => {
    if (percentage >= 90) return { grade: 'A', color: 'text-emerald-400' };
    if (percentage >= 80) return { grade: 'B', color: 'text-green-400' };
    if (percentage >= 70) return { grade: 'C', color: 'text-lime-400' };
    if (percentage >= 60) return { grade: 'D', color: 'text-yellow-400' };
    return { grade: 'F', color: 'text-red-400' };
  };

  if (!isTestStarted) {
    return (
      <div className="test-container">
        <div className="test-card">
          <h2 className="test-title">Network Security Basics</h2>
          <div className="test-info">
            <p>Test Duration: 10 minutes</p>
            <p>Total Questions: {questions.length}</p>
            <p>Required Score: 70% to pass</p>
          </div>
          <button onClick={handleStartTest} className="start-button">
            Start Test
          </button>
        </div>
      </div>
    );
  }

  if (showResults) {
    const percentage = ((score / questions.length) * 100);
    const { grade, color } = getGrade(percentage);
    return (
      <div className="test-container">
        <div className="test-card">
          <h2 className="test-title">Test Results</h2>
          <div className="results-container">
            <div className="score-card">
              <p className="final-score">Score: {score} out of {questions.length}</p>
              <p className="percentage">Percentage: {percentage.toFixed(1)}%</p>
              <p className={`grade ${color}`}>Grade: {grade}</p>
              {percentage >= 70 && (
                <div className="certificate-section">
                  <p>🎉 Congratulations! You passed!</p>
                  <div className="email-section">
                    <input
                      type="email"
                      value={userEmail}
                      onChange={(e) => {
                        setUserEmail(e.target.value);
                        setCertificateError(null);
                      }}
                      placeholder="Enter your email to receive certificate"
                      className={`email-input ${certificateError ? 'border-red-500' : ''}`}
                      disabled={isGeneratingCertificate}
                    />
                    {certificateError && (
                      <p className="error-message text-red-500 text-sm mt-1">
                        {certificateError}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={handleTestCompletion}
                    className={`certificate-button ${
                      isGeneratingCertificate ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    disabled={isGeneratingCertificate || !userEmail}
                  >
                    {isGeneratingCertificate ? (
                      <span>Generating Certificate...</span>
                    ) : (
                      'Get Certificate'
                    )}
                  </button>
                </div>
              )}
              {percentage < 70 && (
                <p className="pass-status">📚 Keep studying and try again!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="test-container">
      <div className="test-card">
        <div className="test-header">
          <span className="question-counter">Question {currentQuestion + 1}/{questions.length}</span>
          <span className="timer">Time Left: {formatTime(timeLeft)}</span>
        </div>
        
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          ></div>
        </div>

        <div className="question-container">
          <h3 className="question-text">{questions[currentQuestion].question}</h3>
          <div className="options-container">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`option-button ${selectedAnswer === index ? 'selected' : ''}`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleNextQuestion}
          disabled={selectedAnswer === null}
          className="next-button"
        >
          {currentQuestion === questions.length - 1 ? 'Finish Test' : 'Next Question'}
        </button>
      </div>
    </div>
  );
};

export default NetworkSecurityTest;