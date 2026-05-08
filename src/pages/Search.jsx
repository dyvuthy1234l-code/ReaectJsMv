import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import MovieCard, { MovieCardSkeleton } from '../components/MovieCard';
import { searchMovies } from '../services/api';
import { useDebounce } from '../hooks';
import './Search.css';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [query,   setQuery  ] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page,    setPage   ] = useState(1);
  const [total,   setTotal  ] = useState(0);

  const debouncedQ = useDebounce(query, 350);

  useEffect(() => { setPage(1); }, [debouncedQ]);

  useEffect(() => {
    if (!debouncedQ.trim()) {
      setResults([]);
      setTotal(0);
      return;
    }

    setLoading(true);
    searchMovies(debouncedQ, page)
      .then(r => {
        setResults(r.results);
        setTotal(r.total_results);
      })
      .catch(console.error)
      .finally(() => setLoading(false));

    setSearchParams({ q: debouncedQ });
  }, [debouncedQ, page]);

  return (
    <div className="search-page">
      <div className="container">

        <h1 className="section-title search-page__heading">🔍 Search</h1>

        <div className="search-page__input-wrap">
          <span className="search-page__icon">🔍</span>
          <input
            className="search-page__input"
            type="text"
            placeholder="Search for a movie..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
          />
          {query && (
            <button className="search-page__clear" onClick={() => setQuery('')}>✕</button>
          )}
        </div>

        {debouncedQ && !loading && (
          <p className="search-page__count">
            {total > 0
              ? `Found ${total.toLocaleString()} results for "${debouncedQ}"`
              : `No results for "${debouncedQ}"`}
          </p>
        )}

        <div className="row g-3">
          {loading
            ? Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="col-6 col-sm-4 col-md-3 col-xl-2">
                  <MovieCardSkeleton />
                </div>
              ))
            : results.map(m => (
                <div key={m.id} className="col-6 col-sm-4 col-md-3 col-xl-2">
                  <MovieCard movie={m} />
                </div>
              ))
          }
        </div>

        {!loading && !debouncedQ && (
          <div className="empty-state">
            <div className="icon">🎬</div>
            <h3>Start searching</h3>
            <p>Type a movie title to find what you're looking for</p>
          </div>
        )}

        {!loading && debouncedQ && results.length === 0 && (
          <div className="empty-state">
            <div className="icon">😕</div>
            <h3>Nothing found</h3>
            <p>Try a different search term</p>
          </div>
        )}

      </div>
    </div>
  );
}
