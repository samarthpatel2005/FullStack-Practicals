import { useEffect, useState } from 'react';
import './App.css';
import ContentRow from './components/ContentRow/ContentRow';
import Hero from './components/Hero/Hero';
import Loading from './components/Loading/Loading';
import Modal from './components/Modal/Modal';
import Navbar from './components/Navbar/Navbar';
import { getMovies, getTVShows, searchMovies } from './services/api';

function App() {
  const [movies, setMovies] = useState([]);
  const [tvShows, setTVShows] = useState([]);
  const [featuredContent, setFeaturedContent] = useState(null);
  const [selectedContent, setSelectedContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [moviesData, tvShowsData] = await Promise.all([
        getMovies(),
        getTVShows()
      ]);
      
      setMovies(moviesData);
      setTVShows(tvShowsData);
      
      // Set first movie as featured content
      if (moviesData.length > 0) {
        setFeaturedContent(moviesData[0]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      try {
        const results = await searchMovies(query);
        setSearchResults(results);
      } catch (error) {
        console.error('Error searching:', error);
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleContentClick = (content) => {
    setSelectedContent(content);
  };

  const closeModal = () => {
    setSelectedContent(null);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="App">
      <Navbar onSearch={handleSearch} />
      
      {searchQuery && searchResults.length > 0 ? (
        <div className="search-results">
          <ContentRow 
            title={`Search Results for "${searchQuery}"`}
            content={searchResults}
            onContentClick={handleContentClick}
          />
        </div>
      ) : (
        <>
          {featuredContent && (
            <Hero 
              content={featuredContent}
              onPlayClick={() => handleContentClick(featuredContent)}
            />
          )}
          
          <div className="content-rows">
            {movies.length > 0 && (
              <ContentRow 
                title="Popular Movies"
                content={movies}
                onContentClick={handleContentClick}
              />
            )}
            
            {tvShows.length > 0 && (
              <ContentRow 
                title="TV Shows"
                content={tvShows}
                onContentClick={handleContentClick}
              />
            )}
          </div>
        </>
      )}
      
      {selectedContent && (
        <Modal 
          content={selectedContent}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

export default App;