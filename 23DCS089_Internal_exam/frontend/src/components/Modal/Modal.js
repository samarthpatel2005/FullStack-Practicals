import { useEffect } from 'react';
import { getBackdropUrl, getPosterUrl } from '../../services/api';
import './Modal.css';

const Modal = ({ content, onClose }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getTrailerUrl = () => {
    if (content.trailerUrl) {
      return content.trailerUrl;
    }
    
    // Generate a YouTube search URL as fallback
    const searchQuery = encodeURIComponent(`${content.title || content.name} trailer`);
    return `https://www.youtube.com/results?search_query=${searchQuery}`;
  };

  const handleWatchTrailer = () => {
    const trailerUrl = getTrailerUrl();
    window.open(trailerUrl, '_blank');
  };

  if (!content) return null;

  return (
    <div className="modal" onClick={handleBackdropClick}>
      <div className="modal__content">
        <button className="modal__close" onClick={onClose}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div className="modal__hero">
          <img
            src={getBackdropUrl(content.backdropPath)}
            alt={content.title || content.name}
            className="modal__hero-image"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/1920x1080/333333/ffffff?text=No+Image';
            }}
          />
          <div className="modal__hero-overlay">
            <div className="modal__hero-content">
              <h1 className="modal__title">
                {content.title || content.name}
              </h1>
              
              <div className="modal__hero-buttons">
                <button className="modal__button modal__button--play" onClick={handleWatchTrailer}>
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
                  Watch Trailer
                </button>
                
                <button className="modal__button modal__button--like">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20.84 4.61c-1.5-1.5-3.93-1.5-5.43 0L12 8.03 8.59 4.61c-1.5-1.5-3.93-1.5-5.43 0s-1.5 3.93 0 5.43L12 18.88l8.84-8.84c1.5-1.5 1.5-3.93 0-5.43z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                
                <button className="modal__button modal__button--add">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 5v14M5 12h14"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal__info">
          <div className="modal__main-info">
            <div className="modal__metadata">
              {content.year && <span className="modal__year">{content.year}</span>}
              {content.rating && <span className="modal__rating">IMDb {content.rating}</span>}
              {content.runtime && <span className="modal__runtime">{content.runtime}</span>}
              {content.rated && <span className="modal__rated">{content.rated}</span>}
            </div>

            {content.overview && (
              <p className="modal__description">
                {content.overview}
              </p>
            )}
          </div>

          <div className="modal__details">
            <div className="modal__poster">
              <img
                src={getPosterUrl(content.posterPath)}
                alt={content.title || content.name}
                className="modal__poster-image"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300x450/333333/ffffff?text=No+Image';
                }}
              />
            </div>

            <div className="modal__details-info">
              {content.cast && content.cast.length > 0 && (
                <div className="modal__detail">
                  <span className="modal__detail-label">Cast:</span>
                  <span className="modal__detail-value">
                    {content.cast.slice(0, 5).join(', ')}
                  </span>
                </div>
              )}

              {content.genres && content.genres.length > 0 && (
                <div className="modal__detail">
                  <span className="modal__detail-label">Genres:</span>
                  <span className="modal__detail-value">
                    {content.genres.map(genre => genre.name || genre).join(', ')}
                  </span>
                </div>
              )}

              {content.director && (
                <div className="modal__detail">
                  <span className="modal__detail-label">Director:</span>
                  <span className="modal__detail-value">{content.director}</span>
                </div>
              )}

              {content.country && (
                <div className="modal__detail">
                  <span className="modal__detail-label">Country:</span>
                  <span className="modal__detail-value">{content.country}</span>
                </div>
              )}

              {content.language && (
                <div className="modal__detail">
                  <span className="modal__detail-label">Language:</span>
                  <span className="modal__detail-value">{content.language}</span>
                </div>
              )}

              {content.awards && (
                <div className="modal__detail">
                  <span className="modal__detail-label">Awards:</span>
                  <span className="modal__detail-value">{content.awards}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;