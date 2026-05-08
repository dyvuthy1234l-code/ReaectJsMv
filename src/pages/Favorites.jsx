import { Link } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import { useApp } from '../context/AppContext';
import './Favorites.css';

export default function Favorites() {
  const { favorites, user } = useApp();

  if (!user) {
    return (
      <div className="favorites-page">
        <div className="container">
          <div className="empty-state empty-state--tall">
            <div className="icon">🔐</div>
            <h3>Sign in to view your list</h3>
            <p>Keep track of movies you love</p>
            <Link to="/login" className="btn btn-primary favorites-page__cta">Sign In</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="favorites-page">
      <div className="container">

        <div className="favorites-page__header">
          <h1 className="section-title">❤️ My List</h1>
          <span className="favorites-page__count">
            {favorites.length} movie{favorites.length !== 1 ? 's' : ''}
          </span>
        </div>

        {favorites.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🎬</div>
            <h3>Your list is empty</h3>
            <p>Browse movies and add them to your favorites</p>
            <Link to="/movies" className="btn btn-primary favorites-page__cta">Browse Movies</Link>
          </div>
        ) : (
          <div className="row g-3">
            {favorites.map(m => (
              <div key={m.id} className="col-6 col-sm-4 col-md-3 col-xl-2">
                <MovieCard movie={m} />
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
