import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import MovieSlider from '../components/MovieSlider';
import { getMovieDetail, IMG } from '../services/api';
import { useApp } from '../context/AppContext';
import './MovieDetail.css';

export default function MovieDetail() {
  const { id } = useParams();
  const { isFavorite, toggleFavorite } = useApp();

  const [movie,       setMovie      ] = useState(null);
  const [loading,     setLoading    ] = useState(true);
  const [error,       setError      ] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [activeTab,   setActiveTab  ] = useState('overview');

  useEffect(() => {
    setLoading(true);
    setShowTrailer(false);
    setActiveTab('overview');
    window.scrollTo(0, 0);

    getMovieDetail(id)
      .then(setMovie)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="detail-loading">
        <div className="skeleton detail-loading__backdrop" />
        <div className="container">
          <div className="skeleton detail-loading__poster" />
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="error-state error-state--page">
        <h3>⚠️ Oops!</h3>
        <p>{error || 'Movie not found.'}</p>
        <Link to="/movies" className="btn btn-primary" style={{ marginTop: 20 }}>Browse Movies</Link>
      </div>
    );
  }

  const fav      = isFavorite(movie.id);
  const trailer  = movie.videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube');
  const director = movie.credits?.crew?.find(c => c.job === 'Director');
  const cast     = movie.credits?.cast?.slice(0, 10) || [];
  const similar  = movie.similar?.results || [];
  const rating   = movie.vote_average?.toFixed(1);
  const runtime  = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
    : null;

  return (
    <div className="movie-detail">

      {/* Fixed backdrop image */}
      <div
        className="movie-detail__backdrop"
        style={{ '--bg': movie.backdrop_path ? `url(${IMG.backdrop(movie.backdrop_path)})` : 'none' }}
      >
        <div className="movie-detail__backdrop-gradient" />
      </div>

      <div className="container">
        {/* Bootstrap row: poster col + info col */}
        <div className="row movie-detail__main">

          {/* Poster */}
          <div className="col-12 col-sm-5 col-md-4 col-lg-3">
            <div className="movie-detail__poster">
              <img src={IMG.poster(movie.poster_path, 'w500')} alt={movie.title} />
              {movie.vote_average > 0 && (
                <div className="movie-detail__poster-rating">
                  ⭐ {rating} <span>/ 10</span>
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="col-12 col-sm-7 col-md-8 col-lg-9">
            <div className="movie-detail__info">

              <div className="movie-detail__genres">
                {movie.genres?.map(g => (
                  <Link key={g.id} to={`/genres?id=${g.id}&name=${g.name}`} className="genre-tag">
                    {g.name}
                  </Link>
                ))}
              </div>

              <h1 className="movie-detail__title">{movie.title}</h1>

              {movie.tagline && (
                <p className="movie-detail__tagline">"{movie.tagline}"</p>
              )}

              <div className="movie-detail__meta">
                {movie.release_date && <span>📅 {movie.release_date.slice(0, 4)}</span>}
                {runtime           && <span>⏱ {runtime}</span>}
                {movie.original_language && (
                  <span>🌐 {movie.original_language.toUpperCase()}</span>
                )}
                {movie.status && (
                  <span className={`badge ${movie.status === 'Released' ? 'badge-gold' : 'badge-dark'}`}>
                    {movie.status}
                  </span>
                )}
              </div>

              <div className="movie-detail__actions">
                {trailer ? (
                  <button className="btn btn-primary" onClick={() => setShowTrailer(true)}>
                    ▶ Watch Trailer
                  </button>
                ) : (
                  <span className="btn btn-secondary movie-detail__no-trailer">No Trailer</span>
                )}

                <button
                  className={`btn ${fav ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => toggleFavorite(movie)}
                >
                  {fav ? '❤️ Favorited' : '🤍 Add to List'}
                </button>

                <button
                  className="btn btn-ghost btn-icon"
                  onClick={() => navigator.clipboard?.writeText(window.location.href)}
                  title="Copy link"
                >
                  🔗
                </button>
              </div>

              {/* Tabs */}
              <div className="movie-detail__tabs">
                {['overview', 'cast', 'details'].map(tab => (
                  <button
                    key={tab}
                    className={`movie-detail__tab ${activeTab === tab ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {activeTab === 'overview' && (
                <div className="movie-detail__tab-content">
                  <p className="movie-detail__overview">
                    {movie.overview || 'No overview available.'}
                  </p>
                  {director && (
                    <p className="movie-detail__director">
                      <strong>Director:</strong> {director.name}
                    </p>
                  )}
                </div>
              )}

              {activeTab === 'cast' && (
                <div className="movie-detail__cast-grid">
                  {cast.map(a => (
                    <div key={a.id} className="cast-card">
                      <img
                        src={
                          a.profile_path
                            ? IMG.poster(a.profile_path, 'w185')
                            : 'https://via.placeholder.com/80x100/13131e/555?text=?'
                        }
                        alt={a.name}
                      />
                      <span className="cast-name">{a.name}</span>
                      <span className="cast-char">{a.character}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'details' && (
                <div className="movie-detail__details-list">
                  {movie.budget  > 0 && <div><strong>Budget</strong><span>${(movie.budget  / 1e6).toFixed(0)}M</span></div>}
                  {movie.revenue > 0 && <div><strong>Revenue</strong><span>${(movie.revenue / 1e6).toFixed(0)}M</span></div>}
                  {movie.vote_count && (
                    <div><strong>Votes</strong><span>{movie.vote_count.toLocaleString()}</span></div>
                  )}
                  {movie.production_countries?.length > 0 && (
                    <div>
                      <strong>Country</strong>
                      <span>{movie.production_countries.map(c => c.name).join(', ')}</span>
                    </div>
                  )}
                  {movie.production_companies?.length > 0 && (
                    <div>
                      <strong>Studio</strong>
                      <span>{movie.production_companies.slice(0, 2).map(c => c.name).join(', ')}</span>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* Related movies */}
      {similar.length > 0 && (
        <div className="movie-detail__similar">
          <MovieSlider title="You May Also Like" movies={similar} />
        </div>
      )}

      {/* Trailer modal */}
      {showTrailer && trailer && (
        <div className="trailer-modal" onClick={() => setShowTrailer(false)}>
          <div className="trailer-modal__content" onClick={e => e.stopPropagation()}>
            <button className="trailer-modal__close" onClick={() => setShowTrailer(false)}>✕</button>
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
              title="Trailer"
              allowFullScreen
              allow="autoplay"
            />
          </div>
        </div>
      )}

    </div>
  );
}
