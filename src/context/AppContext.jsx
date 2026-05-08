// ─────────────────────────────────────────────
//  context/AppContext.jsx
//  Upgraded from: vanilla JS favBtn + localStorage in m1.html
//  Now: full Context API with favorites, auth, toast, genres
// ─────────────────────────────────────────────
import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';

const AppContext = createContext(null);

const initialState = {
  favorites: JSON.parse(localStorage.getItem('cineverse_favorites') || '[]'),
  user: JSON.parse(localStorage.getItem('cineverse_user') || 'null'),
  subscription: localStorage.getItem('cineverse_plan') || null, // 'basic' | 'premium'
  toast: null,
  genres: [],
};

function reducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_FAVORITE': {
      const exists = state.favorites.some(f => f.id === action.payload.id);
      const favorites = exists
        ? state.favorites.filter(f => f.id !== action.payload.id)
        : [...state.favorites, action.payload];
      return { ...state, favorites };
    }
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'LOGOUT':
      return { ...state, user: null, subscription: null };
    case 'SET_SUBSCRIPTION':
      return { ...state, subscription: action.payload };
    case 'SHOW_TOAST':
      return { ...state, toast: action.payload };
    case 'HIDE_TOAST':
      return { ...state, toast: null };
    case 'SET_GENRES':
      return { ...state, genres: action.payload };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Persist favorites
  useEffect(() => {
    localStorage.setItem('cineverse_favorites', JSON.stringify(state.favorites));
  }, [state.favorites]);

  // Persist user
  useEffect(() => {
    if (state.user) localStorage.setItem('cineverse_user', JSON.stringify(state.user));
    else localStorage.removeItem('cineverse_user');
  }, [state.user]);

  // Persist subscription
  useEffect(() => {
    if (state.subscription) localStorage.setItem('cineverse_plan', state.subscription);
    else localStorage.removeItem('cineverse_plan');
  }, [state.subscription]);

  // Auto-hide toast
  useEffect(() => {
    if (state.toast) {
      const t = setTimeout(() => dispatch({ type: 'HIDE_TOAST' }), 3000);
      return () => clearTimeout(t);
    }
  }, [state.toast]);

  const toggleFavorite = useCallback((movie) => {
    const isFav = state.favorites.some(f => f.id === movie.id);
    dispatch({ type: 'TOGGLE_FAVORITE', payload: movie });
    dispatch({
      type: 'SHOW_TOAST',
      payload: isFav
        ? { message: `Removed "${movie.title}" from favorites`, type: 'info' }
        : { message: `Added "${movie.title}" to favorites`, type: 'success' }
    });
  }, [state.favorites]);

  const isFavorite = useCallback((id) => state.favorites.some(f => f.id === id), [state.favorites]);

  const login = useCallback((userData) => {
    dispatch({ type: 'SET_USER', payload: userData });
    dispatch({ type: 'SHOW_TOAST', payload: { message: `Welcome back, ${userData.name}!`, type: 'success' } });
  }, []);

  const logout = useCallback(() => {
    dispatch({ type: 'LOGOUT' });
    dispatch({ type: 'SHOW_TOAST', payload: { message: 'Logged out successfully', type: 'info' } });
  }, []);

  const subscribe = useCallback((plan) => {
    dispatch({ type: 'SET_SUBSCRIPTION', payload: plan });
    dispatch({ type: 'SHOW_TOAST', payload: { message: `${plan.charAt(0).toUpperCase() + plan.slice(1)} plan activated!`, type: 'success' } });
  }, []);

  const showToast = useCallback((message, type = 'info') => {
    dispatch({ type: 'SHOW_TOAST', payload: { message, type } });
  }, []);

  const value = {
    ...state,
    toggleFavorite,
    isFavorite,
    login,
    logout,
    subscribe,
    showToast,
    setGenres: (genres) => dispatch({ type: 'SET_GENRES', payload: genres }),
  };

  return (
    <AppContext.Provider value={value}>
      {children}
      {state.toast && (
        <div className={`toast show`} style={{ borderLeftColor: state.toast.type === 'success' ? '#22c55e' : 'var(--accent)' }}>
          {state.toast.type === 'success' ? '✅ ' : 'ℹ️ '} {state.toast.message}
        </div>
      )}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
};
