
import { useEffect, useState } from 'react';

const Home = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    setTimeout(() => setIsVisible(true), 100);

    return () => clearInterval(timer);
  }, []);

  const handleCounterClick = () => {
    setCount(count + 1);
  };

  const resetCounter = () => {
    setCount(0);
  };

  return (
    <div className={`page-content ${isVisible ? 'fade-in' : ''}`}>
      <div className="hero-section">
        <h1 className="hero-title">Welcome Home</h1>
        <p className="hero-subtitle">Experience the future of web design</p>
      </div>

      <div className="feature-grid">
        <div className="feature-card">
          <div className="card-icon">🕒</div>
          <h3>Live Clock</h3>
          <div className="live-time">
            {currentTime.toLocaleTimeString()}
          </div>
        </div>

        <div className="feature-card">
          <div className="card-icon">🎯</div>
          <h3>Interactive Counter</h3>
          <div className="counter-display">{count}</div>
          <div className="counter-buttons">
            <button className="btn-primary" onClick={handleCounterClick}>
              Increment
            </button>
            <button className="btn-secondary" onClick={resetCounter}>
              Reset
            </button>
          </div>
        </div>

        <div className="feature-card">
          <div className="card-icon">⭐</div>
          <h3>Features</h3>
          <ul className="feature-list">
            <li>Responsive Design</li>
            <li>Smooth Animations</li>
            <li>Modern UI/UX</li>
            <li>Interactive Elements</li>
          </ul>
        </div>
      </div>

      <div className="stats-section">
        <div className="stat-item">
          <div className="stat-number">100+</div>
          <div className="stat-label">Happy Users</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">50+</div>
          <div className="stat-label">Projects</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">24/7</div>
          <div className="stat-label">Support</div>
        </div>
      </div>
    </div>
  );
};

export default Home;
