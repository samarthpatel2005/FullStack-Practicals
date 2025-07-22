
import { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ name: '', email: '', message: '' });
      }, 3000);
    } else {
      setErrors(newErrors);
    }
  };

  const contactInfo = [
    { icon: '📧', label: 'Email', value: 'contact@company.com' },
    { icon: '📞', label: 'Phone', value: '+1 (555) 123-4567' },
    { icon: '📍', label: 'Address', value: '123 Tech Street, Digital City, DC 12345' },
    { icon: '🕐', label: 'Hours', value: 'Mon-Fri 9AM-6PM' }
  ];

  return (
    <div className="page-content fade-in">
      <div className="contact-header">
        <h1>Get In Touch</h1>
        <p className="contact-subtitle">We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
      </div>

      <div className="contact-container">
        <div className="contact-info">
          <h2>Contact Information</h2>
          <div className="info-grid">
            {contactInfo.map((info, index) => (
              <div key={index} className="info-item">
                <div className="info-icon">{info.icon}</div>
                <div className="info-content">
                  <div className="info-label">{info.label}</div>
                  <div className="info-value">{info.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="contact-form-container">
          <h2>Send Message</h2>
          {isSubmitted ? (
            <div className="success-message">
              <div className="success-icon">✅</div>
              <h3>Message Sent Successfully!</h3>
              <p>Thank you for contacting us. We'll get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={errors.name ? 'error' : ''}
                  placeholder="Enter your full name"
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={errors.email ? 'error' : ''}
                  placeholder="Enter your email address"
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className={errors.message ? 'error' : ''}
                  placeholder="Enter your message"
                  rows="5"
                ></textarea>
                {errors.message && <span className="error-message">{errors.message}</span>}
              </div>

              <button type="submit" className="submit-btn">
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="map-section">
        <h2>Find Us</h2>
        <div className="map-placeholder">
          <div className="map-icon">🗺️</div>
          <p>Interactive Map Coming Soon</p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
