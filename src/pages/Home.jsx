import { Link } from 'react-router-dom';
import './Home.css';
import heroImage from '../assets/hero.png';

function Home() {
  return (
    <div className="home-container">

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Unlock Your Cybersecurity Potential</h1>
          <p>
            Start a journey of discovery and expertise with our comprehensive cybersecurity training platform.
            Dive into certifications, hands-on labs, and courses to build your skills and boost your career.
          </p>
          <Link to="/courses">
            <button className="cta-button">Start Learning Now</button>
          </Link>
        </div>
        <div className="hero-image">
          <img src={heroImage} alt="Cybersecurity Action" />
        </div>
      </section>

      {/* Statistics Section */}
      <section className="stats-section">
        <div className="stat">
          <h3>20+</h3>
          <p>Expert-Led Courses</p>
        </div>
        <div className="stat">
          <h3>100+</h3>
          <p>Active Students</p>
        </div>
        <div className="stat">
          <h3>50+</h3>
          <p>Certificates Issued</p>
        </div>
        <div className="stat">
          <h3>95%</h3>
          <p>Success Rate</p>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="feature-card">
          <h3>Advanced Courses</h3>
          <p>Stay ahead with cutting-edge courses designed to meet industry standards.</p>
        </div>
        <div className="feature-card">
          <h3>Real-World Simulations</h3>
          <p>Test your skills with real-world challenges and interactive labs.</p>
        </div>
        <div className="feature-card">
          <h3>Industry-Recognized Certifications</h3>
          <p>Earn certificates that add value to your professional profile.</p>
        </div>
        <div className="feature-card">
          <h3>Personalized Learning Paths</h3>
          <p>Choose from beginner to advanced levels and customize your learning journey.</p>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <h2>What Our Students Say</h2>
        <div className="testimonial-card">
          <p>“The best cybersecurity course I’ve taken! The labs are challenging and the instructors are top-notch.”</p>
          <p>- Yosser Ghrairi, Network Engineer</p>
        </div>
        <div className="testimonial-card">
          <p>“This platform transformed my career. The certifications helped me land my dream job!”</p>
          <p>- Adem Ayedi, Security Analyst</p>
        </div>
      </section>

    </div>
  );
}

export default Home;
