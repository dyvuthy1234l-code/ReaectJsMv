import { useState, useEffect } from 'react';
import MovieCard, { MovieCardSkeleton } from '../components/MovieCard';
import { getPopular, getTopRated, getByGenre, getGenres } from '../services/api';
import { useApp } from '../context/AppContext';
import './Movies.css';

const SORT_OPTIONS = [
  { value: 'popular',   label: '🔥 Popular'   },
  { value: 'top_rated', label: '⭐ Top Rated' },
];

export default function Movies() {
  const { genres, setGenres } = useApp();

  const [movies,        setMovies       ] = useState([]);
  const [loading,       setLoading      ] = useState(true);
  const [page,          setPage         ] = useState(1);
  const [totalPages,    setTotalPages   ] = useState(1);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [sortBy,        setSortBy       ] = useState('popular');

  useEffect(() => {
    if (!genres.length) {
      getGenres().then(r => setGenres(r.genres)).catch(console.error);
    }
  }, []);

  useEffect(() => {
    setLoading(true);

    const fetcher = selectedGenre
      ? getByGenre(selectedGenre, page)
      : sortBy === 'top_rated'
        ? getTopRated(page)
        : getPopular(page);

    fetcher
      .then(r => {
        setMovies(r.results);
        setTotalPages(Math.min(r.total_pages, 20));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedGenre, sortBy, page]);

  const handleGenre = (id) => {
    setSelectedGenre(prev => (prev === id ? null : id));
    setPage(1);
  };

  const handleSort = (val) => {
    setSortBy(val);
    setSelectedGenre(null);
    setPage(1);
  };

  const pageStart  = Math.max(1, Math.min(page - 2, totalPages - 4));
  const pageWindow = Array.from(
    { length: Math.min(5, totalPages) },
    (_, i) => pageStart + i
  );

  return (
    <div className="movies-page">
      <div className="container">

        <div className="movies-page__header">
          <h1 className="section-title">Browse Movies</h1>
          <div className="movies-page__sort">
            {SORT_OPTIONS.map(opt => (
              <button
                key={opt.value}
                className={`btn ${sortBy === opt.value && !selectedGenre ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => handleSort(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="movies-page__genres">
          {genres.map(g => (
            <button
              key={g.id}
              className={`genre-tag ${selectedGenre === g.id ? 'active' : ''}`}
              onClick={() => handleGenre(g.id)}
            >
              {g.name}
            </button>
          ))}
        </div>

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

        {!loading && totalPages > 1 && (
          <div className="movies-page__pagination">
            <button
              className="btn btn-secondary"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              ‹ Prev
            </button>
            <div className="movies-page__pages">
              {pageWindow.map(p => (
                <button
                  key={p}
                  className={`movies-page__page-btn ${p === page ? 'active' : ''}`}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              ))}
            </div>
            <button
              className="btn btn-secondary"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next ›
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
