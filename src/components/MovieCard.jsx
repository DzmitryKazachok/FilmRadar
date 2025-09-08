import React from "react";

const MovieCard = ({ movie, onMovieClick }) => {
  const { title, vote_average, poster_path, release_date, original_language } = movie;
  
  const handleClick = () => {
    onMovieClick(movie);
  };

  return (
    <div className="movie-card" onClick={handleClick}>
      <img 
        src={poster_path ? `https://image.tmdb.org/t/p/w500${poster_path}` : '/no-poster.png'} 
        alt={`${title} Poster`}
        loading="lazy"
        decoding="async"
      />
      
      <div className="mt-4">
        <h3>{title}</h3>

        <div className="content">
          <div className="rating">
            <img src="star.svg" alt="Star Icon" loading="lazy" />
            <p>{vote_average ? vote_average.toFixed(1) : 'N/A'}</p>
          </div>

          <span>•</span>
          <p className="lang">{original_language}</p>

          <span>•</span>
          <p className="year">{release_date ? release_date.split('-')[0] : 'N/A'}</p>
        </div>
      </div>
    </div>
   );
}
 
export default MovieCard;