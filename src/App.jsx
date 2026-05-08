import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';

const Home         = lazy(() => import('./pages/Home'));
const Movies       = lazy(() => import('./pages/Movies'));
const MovieDetail  = lazy(() => import('./pages/MovieDetail'));
const Search       = lazy(() => import('./pages/Search'));
const Favorites    = lazy(() => import('./pages/Favorites'));
const Login        = lazy(() => import('./pages/Login'));
const Subscription = lazy(() => import('./pages/Subscription'));
const Genres       = lazy(() => import('./pages/Genres'));

const Spinner = () => (
  <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'60vh' }}>
    <div style={{
      width: 36, height: 36,
      border: '2px solid var(--bg-elevated)',
      borderTopColor: 'var(--accent)',
      borderRadius: '50%',
      animation: 'spin 0.7s linear infinite',
      boxShadow: '0 0 12px var(--accent-glow)'
    }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Navbar />
        <main>
          <Suspense fallback={<Spinner />}>
            <Routes>
              <Route path="/"             element={<Home />} />
              <Route path="/movies"       element={<Movies />} />
              <Route path="/movie/:id"    element={<MovieDetail />} />
              <Route path="/search"       element={<Search />} />
              <Route path="/genres"       element={<Genres />} />
              <Route path="/login"        element={<Login />} />
              <Route path="/subscription" element={<Subscription />} />
              <Route path="/favorites"    element={<PrivateRoute><Favorites /></PrivateRoute>} />
              <Route path="*" element={
                <div className="error-state" style={{ paddingTop: 120 }}>
                  <h3>404 — PAGE NOT FOUND</h3>
                  <p>Looks like you wandered off the reel.</p>
                  <a href="/" className="btn btn-primary" style={{ marginTop: 24, display:'inline-flex' }}>Go Home</a>
                </div>
              } />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </AppProvider>
    </BrowserRouter>
  );
}
