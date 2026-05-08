import { useRef } from 'react';
import MovieCard, { MovieCardSkeleton } from './MovieCard';
import './MovieSlider.css';

export default function MovieSlider({ title, movies = [], loading = false, count = 8 }) {
  const trackRef = useRef(null);

  const scroll = (dir) => {
    if (!trackRef.current) return;
    const amount = trackRef.current.clientWidth * 0.75;
    trackRef.current.scrollBy({
      left: dir === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  return (
    <section className="movie-slider">

      <div className="movie-slider__header container">
        <h2 className="section-title">{title}</h2>
        <div className="movie-slider__arrows">
          <button className="movie-slider__arrow" onClick={() => scroll('left')} aria-label="Scroll left">‹</button>
          <button className="movie-slider__arrow" onClick={() => scroll('right')} aria-label="Scroll right">›</button>
        </div>
      </div>

      <div className="movie-slider__track-wrap">
        <div className="movie-slider__track" ref={trackRef}>
          {loading
            ? Array.from({ length: count }).map((_, i) => (
                <div key={i} className="movie-slider__item">
                  <MovieCardSkeleton />
                </div>
              ))
            : movies.slice(0, count).map(m => (
                <div key={m.id} className="movie-slider__item">
                  <MovieCard movie={m} />
                </div>
              ))
          }
        </div>
      </div>

    </section>
  );
}
