
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React, { useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

// Fix for default markers in react-leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState([40.7128, -74.0060]); // Default to NYC

  // Get user's current location
  React.useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          // Optional: Center map on user's location
          // setMapCenter([latitude, longitude]);
        },
        (error) => {
          console.log('Error getting location:', error);
          // Keep default location
        }
      );
    }
  }, []);

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

  // Company locations for the map
  const companyLocations = [
    {
      position: [40.7128, -74.0060],
      name: "Main Office",
      address: "123 Tech Street, Digital City, DC 12345",
      phone: "+1 (555) 123-4567"
    },
    {
      position: [40.7589, -73.9851],
      name: "Branch Office",
      address: "456 Innovation Ave, Tech City, TC 67890",
      phone: "+1 (555) 987-6543"
    }
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
        <div className="interactive-map">
          <MapContainer 
            center={mapCenter} 
            zoom={13} 
            style={{ height: '400px', width: '100%', borderRadius: '15px' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {companyLocations.map((location, index) => (
              <Marker key={index} position={location.position}>
                <Popup>
                  <div className="map-popup">
                    <h3>{location.name}</h3>
                    <p><strong>📍</strong> {location.address}</p>
                    <p><strong>📞</strong> {location.phone}</p>
                    <button 
                      className="directions-btn"
                      onClick={() => window.open(`https://www.google.com/maps/dir//${location.position[0]},${location.position[1]}`, '_blank')}
                    >
                      Get Directions
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
            {userLocation && (
              <Marker position={userLocation}>
                <Popup>
                  <div className="map-popup user-location">
                    <h3>📍 Your Location</h3>
                    <p>You are here!</p>
                    <button 
                      className="directions-btn user-btn"
                      onClick={() => {
                        const nearest = companyLocations[0];
                        window.open(`https://www.google.com/maps/dir/${userLocation[0]},${userLocation[1]}/${nearest.position[0]},${nearest.position[1]}`, '_blank');
                      }}
                    >
                      Directions to Office
                    </button>
                  </div>
                </Popup>
              </Marker>
            )}
          </MapContainer>
        </div>
        
        <div className="location-cards">
          {companyLocations.map((location, index) => (
            <div key={index} className="location-card">
              <h3>{location.name}</h3>
              <p className="location-address">📍 {location.address}</p>
              <p className="location-phone">📞 {location.phone}</p>
              <button 
                className="location-btn"
                onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${location.position[0]},${location.position[1]}`, '_blank')}
              >
                View on Google Maps
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Contact;
