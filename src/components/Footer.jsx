import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="sm-footer">
      <div className="container">

        {/* Bootstrap row for the footer columns */}
        <div className="row g-4 sm-footer__grid">

          {/* Brand */}
          <div className="col-12 col-md-5">
            <Link to="/" className="sm-footer__logo">
              <span className="sm-footer__logo-mark">▶</span>
              SUPER<span className="sm-footer__logo-accent">MOVIE</span>
            </Link>
            <p>The ultimate cinema hub. Discover movies, trailers, and more — all in one powerful place.</p>
            <div className="sm-footer__tagline">POWERED BY TMDB</div>
          </div>

          {/* Navigate */}
          <div className="col-6 col-md-2 offset-md-1">
            <h4>Navigate</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/movies">Movies</Link></li>
              <li><Link to="/genres">Genres</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div className="col-6 col-md-2">
            <h4>Account</h4>
            <ul>
              <li><Link to="/login">Sign In</Link></li>
              <li><Link to="/subscription">Subscribe</Link></li>
              <li><Link to="/favorites">My List</Link></li>
            </ul>
          </div>

          {/* Info */}
          <div className="col-6 col-md-2">
            <h4>Info</h4>
            <ul>
              <li><a href="#">About</a></li>
              <li><a href="#">Privacy</a></li>
              <li><a href="#">Terms</a></li>
            </ul>
          </div>

        </div>

        <div className="sm-footer__bottom">
          <p>
            © 2025 <strong>Super Movie</strong>. All rights reserved.
            Data from <a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer">TMDB</a>.
          </p>
        </div>

      </div>
    </footer>
  );
}
