import React from "react";
import Spinner from "./Spinner";

const MovieModal = ({ movie, isOpen, onClose, isLoading = false }) => {
  if (!isOpen || !movie) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        
        <div className="modal-body">
          {isLoading ? (
            <div className="flex items-center justify-center w-full h-64">
              <Spinner />
            </div>
          ) : (
            <>
              <div className="modal-poster">
                <img 
                  src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/no-poster.png'} 
                  alt={`${movie.title} Poster`}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              
              <div className="modal-info">
                <h2>{movie.title}</h2>
                
                <div className="modal-meta">
                  <div className="rating">
                    <img src="/star.svg" alt="Star Icon" loading="lazy" />
                    <span>{movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</span>
                  </div>
                  
                  <span>•</span>
                  <span className="lang">{movie.original_language?.toUpperCase()}</span>
                  
                  <span>•</span>
                  <span className="year">{movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}</span>
                </div>
                
                {movie.overview && (
                  <div className="overview">
                    <h3>Overview</h3>
                    <p>{movie.overview}</p>
                  </div>
                )}
                
                {movie.genres && movie.genres.length > 0 && (
                  <div className="genres">
                    <h3>Genres</h3>
                    <div className="genre-tags">
                      {movie.genres.map((genre) => (
                        <span key={genre.id} className="genre-tag">
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {movie.runtime && (
                  <div className="runtime">
                    <h3>Runtime</h3>
                    <p>{movie.runtime} minutes</p>
                  </div>
                )}

                {movie.budget && movie.budget > 0 && (
                  <div className="budget">
                    <h3>Budget</h3>
                    <p>${(movie.budget / 1000000).toFixed(1)}M</p>
                  </div>
                )}

                {movie.revenue && movie.revenue > 0 && (
                  <div className="revenue">
                    <h3>Revenue</h3>
                    <p>${(movie.revenue / 1000000).toFixed(1)}M</p>
                  </div>
                )}

                {movie.status && (
                  <div className="status">
                    <h3>Status</h3>
                    <p>{movie.status}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieModal;
