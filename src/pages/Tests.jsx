import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Tests.css';

function Tests() {
  const navigate = useNavigate();
  const testList = [
    { id: 1, name: "Network Security Basics", points: 10 },
    { id: 2, name: "Web Application Security", points: 15 },
    { id: 3, name: "Ethical Hacking Fundamentals", points: 20 },
  ];

  const startTest = (testId) => {
    navigate(`/test/${testId}`);
  };

  return (
    <div className="tests">
      <h2 className="tests-title">Tests</h2>
      <p className="tests-description">
        Test your knowledge with practical assessments and earn points! Choose from the following tests to get started:
      </p>
      <ul className="test-list">
        {testList.map(test => (
          <li key={test.id} className="test-item">
            <h3>{test.name}</h3>
            <p>Points: {test.points}</p>
            <button className="start-button" onClick={() => startTest(test.id)}>Start Test</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Tests;