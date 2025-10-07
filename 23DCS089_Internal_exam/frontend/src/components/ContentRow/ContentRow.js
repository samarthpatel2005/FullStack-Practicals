import { useRef } from 'react';
import { getPosterUrl } from '../../services/api';
import './ContentRow.css';

const ContentRow = ({ title, content, onContentClick }) => {
  const rowRef = useRef(null);

  const scroll = (direction) => {
    const { current } = rowRef;
    if (current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleContentClick = (item) => {
    if (onContentClick) {
      onContentClick(item);
    }
  };

  if (!content || content.length === 0) {
    return null;
  }

  return (
    <div className="content-row">
      <h2 className="content-row__title">{title}</h2>
      
      <div className="content-row__container">
        <button 
          className="content-row__nav content-row__nav--left"
          onClick={() => scroll('left')}
          aria-label="Scroll left"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 18L9 12L15 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div className="content-row__content" ref={rowRef}>
          {content.map((item, index) => (
            <div
              key={item._id || index}
              className="content-row__item"
              onClick={() => handleContentClick(item)}
            >
              <div className="content-row__poster">
                <img
                  src={getPosterUrl(item.posterPath)}
                  alt={item.title || item.name}
                  className="content-row__image"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x450/333333/ffffff?text=No+Image';
                  }}
                />
                
                <div className="content-row__overlay">
                  <div className="content-row__info">
                    <h3 className="content-row__item-title">
                      {item.title || item.name}
                    </h3>
                    
                    <div className="content-row__metadata">
                      {item.year && <span className="content-row__year">{item.year}</span>}
                      {item.rating && (
                        <span className="content-row__rating">
                          ⭐ {item.rating}
                        </span>
                      )}
                    </div>
                    
                    {item.overview && (
                      <p className="content-row__description">
                        {item.overview.length > 100 
                          ? `${item.overview.substring(0, 100)}...`
                          : item.overview
                        }
                      </p>
                    )}
                    
                    <div className="content-row__actions">
                      <button className="content-row__play-btn">
                        <svg
                          width="16"
                          height="16"
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
                      
                      <button className="content-row__info-btn">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"
                            fill="currentColor"
                          />
                        </svg>
                        Info
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button 
          className="content-row__nav content-row__nav--right"
          onClick={() => scroll('right')}
          aria-label="Scroll right"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 18L15 12L9 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ContentRow;