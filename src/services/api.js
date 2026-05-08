// ─────────────────────────────────────────────
//  services/api.js  —  TMDB API integration
//  Migrated & upgraded from original m1.html / m2.html static data
//  Uses free TMDB API key. Replace TMDB_KEY with your own key from
//  https://www.themoviedb.org/settings/api
// ─────────────────────────────────────────────

const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE = 'https://image.tmdb.org/t/p';
const TMDB_KEY = '4f5f43495afcc67e9553f6c684a82f84'; // public demo key

export const IMG = {
  poster: (path, size = 'w500') => path ? `${IMG_BASE}/${size}${path}` : '/no-poster.png',
  backdrop: (path, size = 'w1280') => path ? `${IMG_BASE}/${size}${path}` : null,
  original: (path) => path ? `${IMG_BASE}/original${path}` : null,
};

const get = async (endpoint, params = {}) => {
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set('api_key', TMDB_KEY);
  url.searchParams.set('language', 'en-US');
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`TMDB API error: ${res.status}`);
  return res.json();
};

// Home page sections
export const getTrending = (time = 'week') => get(`/trending/movie/${time}`);
export const getPopular = (page = 1) => get('/movie/popular', { page });
export const getTopRated = (page = 1) => get('/movie/top_rated', { page });
export const getNowPlaying = () => get('/movie/now_playing');
export const getUpcoming = () => get('/movie/upcoming');

// Movie detail
export const getMovieDetail = (id) => get(`/movie/${id}`, { append_to_response: 'credits,videos,similar,reviews' });
export const getMovieVideos = (id) => get(`/movie/${id}/videos`);
export const getSimilar = (id) => get(`/movie/${id}/similar`);

// Search
export const searchMovies = (query, page = 1) => get('/search/movie', { query, page });

// Genres
export const getGenres = () => get('/genre/movie/list');
export const getByGenre = (genreId, page = 1) => get('/discover/movie', { with_genres: genreId, sort_by: 'popularity.desc', page });

// Discover with filters
export const discoverMovies = (params = {}) => get('/discover/movie', { sort_by: 'popularity.desc', ...params });
