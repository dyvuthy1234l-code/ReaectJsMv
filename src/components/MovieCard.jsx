// ─────────────────────────────────────────────
//  components/MovieCard.jsx
//  Upgraded from: static Venom card in m2.html
//  Now: reusable animated card with hover overlay, favorites
// ─────────────────────────────────────────────
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { IMG } from '../services/api';
import './MovieCard.css';

export default function MovieCard({ movie, size = 'md' }) {
  const { isFavorite, toggleFavorite } = useApp();
  const fav = isFavorite(movie.id);

  const handleFav = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(movie);
  };

  const rating = movie.vote_average?.toFixed(1);
  const year = movie.release_date?.slice(0, 4);

  return (
    <Link to={`/movie/${movie.id}`} className={`movie-card movie-card--${size}`}>
      <div className="movie-card__poster">
        <img
          src={IMG.poster(movie.poster_path)}
          alt={movie.title}
          loading="lazy"
          onError={e => { e.target.src = 'https://via.placeholder.com/300x450/13131e/555566?text=No+Poster'; }}
        />
        <div className="movie-card__overlay">
          <div className="movie-card__overlay-top">
            {rating && (
              <span className="movie-card__rating">
                ⭐ {rating}
              </span>
            )}
          </div>
          <div className="movie-card__overlay-bottom">
            <h3 className="movie-card__title">{movie.title}</h3>
            {year && <span className="movie-card__year">{year}</span>}
            <Link to={`/movie/${movie.id}`} className="movie-card__play-btn">▶ Watch</Link>
          </div>
        </div>
        <button
          className={`movie-card__fav ${fav ? 'movie-card__fav--active' : ''}`}
          onClick={handleFav}
          aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
          title={fav ? 'Remove from favorites' : 'Add to favorites'}
        >
          {fav ? '❤️' : '🤍'}
        </button>
      </div>
    </Link>
  );
}

// Skeleton version for loading state
export function MovieCardSkeleton({ size = 'md' }) {
  return (
    <div className={`movie-card movie-card--${size}`}>
      <div className="movie-card__poster skeleton" style={{ height: size === 'lg' ? '380px' : '280px' }} />
    </div>
  );
}
