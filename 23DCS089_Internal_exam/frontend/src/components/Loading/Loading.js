import './Loading.css';

const Loading = () => {
  return (
    <div className="loading">
      <div className="loading__container">
        <div className="loading__logo">
          <h1>NETFLIX</h1>
        </div>
        
        <div className="loading__spinner">
          <div className="loading__spinner-inner"></div>
        </div>
        
        <p className="loading__text">Loading your content...</p>
      </div>
    </div>
  );
};

export default Loading;