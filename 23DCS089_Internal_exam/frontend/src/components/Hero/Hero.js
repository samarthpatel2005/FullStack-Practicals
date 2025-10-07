import { getBackdropUrl } from '../../services/api';
import './Hero.css';

const Hero = ({ content, onPlayClick }) => {
  if (!content) return null;

  const truncateText = (text, maxLength = 150) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const handlePlayClick = () => {
    if (onPlayClick) {
      onPlayClick(content);
    }
  };

  return (
    <div className="hero">
      <div className="hero__background">
        <img
          src={getBackdropUrl(content.backdropPath)}
          alt={content.title || content.name}
          className="hero__background-image"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/1920x1080/000000/ffffff?text=No+Image';
          }}
        />
        <div className="hero__background-overlay"></div>
      </div>

      <div className="hero__content">
        <div className="hero__info">
          <h1 className="hero__title">
            {content.title || content.name}
          </h1>
          
          <div className="hero__metadata">
            {content.year && <span className="hero__year">{content.year}</span>}
            {content.rating && <span className="hero__rating">IMDb {content.rating}</span>}
            {content.runtime && <span className="hero__runtime">{content.runtime}</span>}
          </div>

          <p className="hero__description">
            {truncateText(content.overview || content.plot)}
          </p>

          <div className="hero__buttons">
            <button className="hero__button hero__button--play" onClick={handlePlayClick}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 5.14v13.72L18.5 12 8 5.14z"
                  fill="currentColor"
                />
              </svg>
              Play
            </button>

            <button className="hero__button hero__button--info" onClick={handlePlayClick}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"
                  fill="currentColor"
                />
              </svg>
              More Info
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;