import { Link } from 'react-router-dom';
import './Home.css'; // Dedicated CSS for styling
import heroImage from '../assets/hero.png'; // Replace with your preferred image

function Home() {
  return (
    <div className="home-container">

      <section className="hero-section">
        <div className="hero-content">
          <h1>Elevate Your Cybersecurity Skills</h1>
          <p>
            Gain in-depth knowledge and hands-on experience with our expert-led courses. 
            Prepare for the future with certifications and real-world challenges.
          </p>
          <Link to="/courses">
            <button className="cta-button">Get Started</button>
          </Link>
        </div>
        <div className="hero-image">
          <img src={heroImage} alt="Cybersecurity in Action" />
        </div>
      </section>

      <section className="stats-section">
        <div className="stat">
          <h3>20</h3>
          <p>Courses Available</p>
        </div>
        <div className="stat">
          <h3>10</h3>
          <p>Students Enrolled</p>
        </div>
        <div className="stat">
          <h3>10</h3>
          <p>Certificates Issued</p>
        </div>
      </section>

      <section className="features">
        <div className="feature-card">
          <h3>Comprehensive Courses</h3>
          <p>Stay ahead with updated courses tailored for every skill level.</p>
        </div>
        <div className="feature-card">
          <h3>Real-World Labs</h3>
          <p>Get hands-on experience with practical challenges.</p>
        </div>
        <div className="feature-card">
          <h3>Certified Instructors</h3>
          <p>Learn from industry experts with proven experience.</p>
        </div>
      </section>

    </div>
  );
}

export default Home;
