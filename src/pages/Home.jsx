// ─────────────────────────────────────────────
//  pages/Home.jsx
//  Upgraded from: m2.html (single hero + video)
//  Now: dynamic hero banner + 4 scrollable sections
// ─────────────────────────────────────────────
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MovieSlider from '../components/MovieSlider';
import { getTrending, getPopular, getTopRated, getNowPlaying, IMG } from '../services/api';
import './Home.css';

export default function Home() {
  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [nowPlaying, setNowPlaying] = useState([]);
  const [heroIndex, setHeroIndex] = useState(0);
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getTrending(), getPopular(), getTopRated(), getNowPlaying()])
      .then(([t, p, tr, np]) => {
        setTrending(t.results);
        setPopular(p.results);
        setTopRated(tr.results);
        setNowPlaying(np.results);
        setHeroLoaded(true);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Auto-rotate hero
  useEffect(() => {
    if (!trending.length) return;
    const interval = setInterval(() => setHeroIndex(i => (i + 1) % Math.min(trending.length, 5)), 7000);
    return () => clearInterval(interval);
  }, [trending.length]);

  const hero = trending[heroIndex];
  const backdropUrl = hero ? IMG.backdrop(hero.backdrop_path) : null;

  return (
    <div className="home">
      {/* ── Hero Banner ── */}
      <section className="hero" style={backdropUrl ? { '--bg': `url(${backdropUrl})` } : {}}>
        <div className="hero__backdrop" />
        <div className="hero__gradient" />
        <div className="hero__content container">
          {hero ? (
            <div className={`hero__info ${heroLoaded ? 'hero__info--visible' : ''}`}>
              <div className="hero__badges">
                <span className="badge badge-red">🔥 Trending</span>
                {hero.vote_average && <span className="badge badge-gold">⭐ {hero.vote_average.toFixed(1)}</span>}
                {hero.release_date && <span className="badge badge-dark">{hero.release_date.slice(0, 4)}</span>}
              </div>
              <h1 className="hero__title">{hero.title}</h1>
              <p className="hero__overview">{hero.overview?.slice(0, 200)}{hero.overview?.length > 200 ? '...' : ''}</p>
              <div className="hero__actions">
                <Link to={`/movie/${hero.id}`} className="btn btn-primary">▶ Watch Now</Link>
                <Link to={`/movie/${hero.id}`} className="btn btn-secondary">ℹ More Info</Link>
              </div>
            </div>
          ) : (
            <div className="hero__skeleton">
              <div className="skeleton" style={{ width: 120, height: 24, marginBottom: 16 }} />
              <div className="skeleton" style={{ width: 400, height: 52, marginBottom: 12 }} />
              <div className="skeleton" style={{ width: 500, height: 18, marginBottom: 8 }} />
              <div className="skeleton" style={{ width: 420, height: 18, marginBottom: 24 }} />
              <div style={{ display: 'flex', gap: 12 }}>
                <div className="skeleton" style={{ width: 140, height: 44, borderRadius: 6 }} />
                <div className="skeleton" style={{ width: 120, height: 44, borderRadius: 6 }} />
              </div>
            </div>
          )}
        </div>
        {/* Hero dots */}
        {trending.length > 0 && (
          <div className="hero__dots">
            {Array.from({ length: Math.min(trending.length, 5) }).map((_, i) => (
              <button
                key={i}
                className={`hero__dot ${i === heroIndex ? 'hero__dot--active' : ''}`}
                onClick={() => setHeroIndex(i)}
              />
            ))}
          </div>
        )}
      </section>

      {/* ── Sections ── */}
      <div className="home__sections">
        <MovieSlider title="🔥 Trending This Week" movies={trending} loading={loading} />
        <MovieSlider title="🎬 Now Playing" movies={nowPlaying} loading={loading} />
        <MovieSlider title="🌟 Popular" movies={popular} loading={loading} />
        <MovieSlider title="🏆 Top Rated" movies={topRated} loading={loading} />
      </div>
    </div>
  );
}
