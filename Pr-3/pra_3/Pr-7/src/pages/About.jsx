import { useEffect, useState } from 'react';

const About = () => {
  const [activeTab, setActiveTab] = useState('mission');
  const [skillProgress, setSkillProgress] = useState({
    react: 0,
    javascript: 0,
    css: 0,
    nodejs: 0
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setSkillProgress({
        react: 90,
        javascript: 85,
        css: 95,
        nodejs: 80
      });
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const tabs = {
    mission: {
      title: 'Our Mission',
      content: 'We strive to create innovative web solutions that make a difference in peoples lives. Our commitment to excellence drives us to push the boundaries of what is possible.'
    },
    vision: {
      title: 'Our Vision',
      content: 'To be the leading provider of cutting-edge web technologies, empowering businesses to achieve their digital transformation goals.'
    },
    values: {
      title: 'Our Values',
      content: 'Innovation, integrity, collaboration, and customer satisfaction are at the core of everything we do.'
    }
  };

  const skills = [
    { name: 'React', level: skillProgress.react, color: '#61dafb' },
    { name: 'JavaScript', level: skillProgress.javascript, color: '#f7df1e' },
    { name: 'CSS', level: skillProgress.css, color: '#1572b6' },
    { name: 'Node.js', level: skillProgress.nodejs, color: '#339933' }
  ];

  return (
    <div className="page-content fade-in">
      <div className="about-header">
        <h1>About Us</h1>
        <p className="about-subtitle">Crafting digital experiences with passion and precision</p>
      </div>

      <div className="tabs-container">
        <div className="tab-buttons">
          {Object.keys(tabs).map(tab => (
            <button
              key={tab}
              className={`tab-button ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tabs[tab].title}
            </button>
          ))}
        </div>
        <div className="tab-content">
          <div className="tab-panel">
            <h3>{tabs[activeTab].title}</h3>
            <p>{tabs[activeTab].content}</p>
          </div>
        </div>
      </div>

      <div className="skills-section">
        <h2>Our Expertise</h2>
        <div className="skills-grid">
          {skills.map(skill => (
            <div key={skill.name} className="skill-item">
              <div className="skill-header">
                <span className="skill-name">{skill.name}</span>
                <span className="skill-percentage">{skill.level}%</span>
              </div>
              <div className="skill-bar">
                <div
                  className="skill-progress"
                  style={{
                    width: `${skill.level}%`,
                    backgroundColor: skill.color
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="team-section">
        <h2>Meet Our Team</h2>
        <div className="team-grid">
          <div className="team-member">
            <div className="member-avatar">👨‍💻</div>
            <h3>John Doe</h3>
            <p>Lead Developer</p>
          </div>
          <div className="team-member">
            <div className="member-avatar">👩‍🎨</div>
            <h3>Jane Smith</h3>
            <p>UI/UX Designer</p>
          </div>
          <div className="team-member">
            <div className="member-avatar">👨‍💼</div>
            <h3>Mike Johnson</h3>
            <p>Project Manager</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
