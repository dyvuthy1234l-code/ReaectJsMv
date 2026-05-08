// ─────────────────────────────────────────────
//  Navbar.jsx — Super Movie
//  Brutal Dark × Electric Blue × Bootstrap grid
// ─────────────────────────────────────────────
import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { searchMovies } from '../services/api';
import { useDebounce } from '../hooks';
import './Navbar.css';

export default function Navbar() {
  const { user, favorites, logout } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef(null);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => { setMenuOpen(false); setSearchOpen(false); }, [location]);

  useEffect(() => {
    if (!debouncedQuery.trim()) { setSuggestions([]); return; }
    searchMovies(debouncedQuery, 1).then(r => setSuggestions(r.results.slice(0, 5))).catch(() => {});
  }, [debouncedQuery]);

  useEffect(() => {
    const handler = (e) => { if (searchRef.current && !searchRef.current.contains(e.target)) setSuggestions([]); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    setQuery(''); setSuggestions([]); setSearchOpen(false);
  };

  return (
    <nav className={`sm-navbar ${scrolled ? 'sm-navbar--scrolled' : ''}`}>
      <div className="sm-navbar__inner container">
        {/* ── Logo ── */}
        <Link to="/" className="sm-navbar__logo">
          <span className="sm-navbar__logo-mark">▶</span>
          <span className="sm-navbar__logo-text">SUPER<span className="sm-navbar__logo-accent">MOVIE</span></span>
        </Link>

        {/* ── Nav Links ── */}
        <ul className={`sm-navbar__links ${menuOpen ? 'sm-navbar__links--open' : ''}`}>
          <li><NavLink to="/" end>Home</NavLink></li>
          <li><NavLink to="/movies">Movies</NavLink></li>
          <li><NavLink to="/genres">Genres</NavLink></li>
          <li><NavLink to="/subscription">Subscribe</NavLink></li>
          {user && (
            <li>
              <NavLink to="/favorites">
                Favorites
                {favorites.length > 0 && <span className="sm-navbar__fav-count">{favorites.length}</span>}
              </NavLink>
            </li>
          )}
        </ul>

        {/* ── Actions ── */}
        <div className="sm-navbar__actions">
          {/* Search */}
          <div className={`sm-navbar__search ${searchOpen ? 'sm-navbar__search--open' : ''}`} ref={searchRef}>
            <button className="sm-navbar__search-toggle" onClick={() => setSearchOpen(p => !p)} aria-label="Search">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </button>
            <form onSubmit={handleSearch} className="sm-navbar__search-form">
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search movies..."
                autoFocus={searchOpen}
              />
              {query && (
                <button type="button" className="sm-navbar__search-clear" onClick={() => { setQuery(''); setSuggestions([]); }}>✕</button>
              )}
            </form>
            {suggestions.length > 0 && (
              <ul className="sm-navbar__suggestions">
                {suggestions.map(m => (
                  <li key={m.id} onClick={() => { navigate(`/movie/${m.id}`); setQuery(''); setSuggestions([]); setSearchOpen(false); }}>
                    <img src={m.poster_path ? `https://image.tmdb.org/t/p/w92${m.poster_path}` : '/no-poster.png'} alt="" />
                    <div>
                      <span className="sug-title">{m.title}</span>
                      <span className="sug-year">{m.release_date?.slice(0, 4)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Auth */}
          {user ? (
            <div className="sm-navbar__user">
              <span className="sm-navbar__avatar">{user.name[0].toUpperCase()}</span>
              <div className="sm-navbar__user-menu">
                <Link to="/favorites">My List</Link>
                <button onClick={logout}>Sign Out</button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary" style={{ padding: '7px 18px', fontSize: '0.78rem' }}>Sign In</Link>
          )}

          {/* Hamburger */}
          <button className={`sm-navbar__hamburger ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(p => !p)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
      </div>
    </nav>
  );
}
