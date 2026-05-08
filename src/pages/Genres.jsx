import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import MovieCard, { MovieCardSkeleton } from '../components/MovieCard';
import { getGenres, getByGenre } from '../services/api';
import { useApp } from '../context/AppContext';
import './Genres.css';

export default function Genres() {
  const { genres, setGenres } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  const [movies,  setMovies ] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page,    setPage   ] = useState(1);

  const selectedId   = Number(searchParams.get('id'))   || null;
  const selectedName = searchParams.get('name')         || '';

  useEffect(() => {
    if (!genres.length) {
      getGenres().then(r => setGenres(r.genres)).catch(console.error);
    }
  }, []);

  useEffect(() => {
    if (!selectedId) { setMovies([]); return; }

    setLoading(true);
    getByGenre(selectedId, page)
      .then(r => setMovies(r.results))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedId, page]);

  const selectGenre = (g) => {
    setSearchParams({ id: g.id, name: g.name });
    setPage(1);
  };

  return (
    <div className="genres-page">
      <div className="container">

        <h1 className="section-title genres-page__heading">🎭 Genres</h1>

        <div className="genres-page__list">
          {genres.map(g => (
            <button
              key={g.id}
              className={`genre-tag genre-tag--lg ${selectedId === g.id ? 'active' : ''}`}
              onClick={() => selectGenre(g)}
            >
              {g.name}
            </button>
          ))}
        </div>

        {selectedId ? (
          <>
            <h2 className="section-title genres-page__subheading">{selectedName}</h2>
            <div className="row g-3">
              {loading
                ? Array.from({ length: 20 }).map((_, i) => (
                    <div key={i} className="col-6 col-sm-4 col-md-3 col-xl-2">
                      <MovieCardSkeleton />
                    </div>
                  ))
                : movies.map(m => (
                    <div key={m.id} className="col-6 col-sm-4 col-md-3 col-xl-2">
                      <MovieCard movie={m} />
                    </div>
                  ))
              }
            </div>
          </>
        ) : (
          <div className="empty-state">
            <div className="icon">🎬</div>
            <h3>Select a genre</h3>
            <p>Choose a genre above to browse movies</p>
          </div>
        )}

      </div>
    </div>
  );
}
