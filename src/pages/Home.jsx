import { Link } from 'react-router-dom';
import './Home.css'; // Fichier CSS dédié pour cette page
import heroImage from '../assets/hero.jpg'; // Ajoute une image illustrative

function Home() {
  return (
    <div className="home-container">
      <div className="home-content">
        <h1>Master the Art of Cybersecurity</h1>
        <p>
          Join our platform to access engaging courses, practical tests, and certifications.
          Improve your skills, earn points, and track your progress!
        </p>
        <Link to="/courses">
          <button className="cta-button">Explore Courses</button>
        </Link>
      </div>

      <div className="home-image">
        <img src={heroImage} alt="Cybersecurity Illustration" />
      </div>

      <div className="features">
        <div className="feature-card">
          <h3>Interactive Learning</h3>
          <p>Access hands-on labs and real-world scenarios to strengthen your knowledge.</p>
        </div>
        <div className="feature-card">
          <h3>Earn Certifications</h3>
          <p>Complete courses and earn certificates to showcase your expertise.</p>
        </div>
        <div className="feature-card">
          <h3>Track Progress</h3>
          <p>Monitor your growth and stay motivated with our gamified dashboard.</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
