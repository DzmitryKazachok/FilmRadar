import React from "react";
import { useEffect, useState } from "react";
import Search from "./components/Search";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";
import MovieModal from "./components/MovieModal";
import { useDebounce } from "react-use";
import { getTrendingMovies, updateSearchCount } from "./appwrite.js";

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [movieList, setMovieList] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalLoading, setIsModalLoading] = useState(false);

  // Debounce search term input to limit API calls
  // by waiting for the user stop typing for  500ms
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 800, [searchTerm]);

  const fetchMovies = async (query = '') => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const endpoint = query
        ? `/.netlify/functions/tmdb?path=search/movie&query=${encodeURIComponent(query)}`
        : `/.netlify/functions/tmdb?path=discover/movie&sort_by=popularity.desc`;

      const response = await fetch(endpoint);

      if(!response.ok) {
        throw new Error("Failed to fetch movies");
      }

      const data = await response.json();
      
      if(data.Response === "False") {
        setErrorMessage(data.Error || "Error fetching movies");
        setMovieList([]);
        return;
      }

      setMovieList(data.results || []);

      if(query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }
      
    } catch (error) {
      console.error("Error fetching movies:", error);
      setErrorMessage("Failed to fetch movies. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);
    } catch (error) {
      console.error("Error fetching trending movies:", error);
    }
  };

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
    // Загружаем дополнительную информацию о фильме
    fetchMovieDetails(movie.id);
  };

  const fetchMovieDetails = async (movieId) => {
    setIsModalLoading(true);
    try {
      const response = await fetch(`/.netlify/functions/tmdb?path=movie/${movieId}`);
      if (response.ok) {
        const movieDetails = await response.json();
        setSelectedMovie(prev => ({ ...prev, ...movieDetails }));
      }
    } catch (error) {
      console.error("Error fetching movie details:", error);
    } finally {
      setIsModalLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    fetchTrendingMovies();
  }, []);

  // Обработка клавиши Escape и блокировка прокрутки для модального окна
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === "Escape" && isModalOpen) {
        closeModal();
      }
    };

    if (isModalOpen) {
      // Блокируем прокрутку при открытии модального окна
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleEscapeKey);
    } else {
      // Восстанавливаем прокрутку при закрытии модального окна
      document.body.style.overflow = "auto";
    }
    
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
      // Восстанавливаем прокрутку при размонтировании
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen]);

  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header>
          <img src="./hero-img.png" alt="Hero Banner" />
          <h1>Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle</h1>
          
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
        </header>

        {trendingMovies.length > 0 && (
          <section className="trending">
            <h2>Trending Movies</h2>
            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="all-movies">
          <h2>All Movies</h2>

          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard 
                  key={movie.id} 
                  movie={movie} 
                  onMovieClick={handleMovieClick}
                />                
              ))}
            </ul>
          )}
        </section>

      </div>
      
      <MovieModal 
        movie={selectedMovie}
        isOpen={isModalOpen}
        onClose={closeModal}
        isLoading={isModalLoading}
      />
    </main>
  );
}
 
export default App;