import { useEffect, useState } from 'react';
import './Navbar.css';

const Navbar = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // Auto-search as user types (debounced)
    if (query.trim()) {
      onSearch(query.trim());
    } else {
      onSearch('');
    }
  };

  return (
    <nav className={`navbar ${isScrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__container">
        <div className="navbar__left">
          <div className="navbar__logo">
            <h1>NETFLIX</h1>
          </div>
          
          <ul className="navbar__menu">
            <li className="navbar__menu-item navbar__menu-item--active">
              <a href="#home">Home</a>
            </li>
            <li className="navbar__menu-item">
              <a href="#tv-shows">TV Shows</a>
            </li>
            <li className="navbar__menu-item">
              <a href="#movies">Movies</a>
            </li>
            <li className="navbar__menu-item">
              <a href="#new">New & Popular</a>
            </li>
            <li className="navbar__menu-item">
              <a href="#my-list">My List</a>
            </li>
          </ul>
        </div>

        <div className="navbar__right">
          <form className="navbar__search" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Search movies and TV shows..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="navbar__search-input"
            />
            <button type="submit" className="navbar__search-button">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </form>

          <div className="navbar__profile">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png"
              alt="Profile"
              className="navbar__avatar"
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;