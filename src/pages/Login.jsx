import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './Login.css';

export default function Login() {
  const { login }   = useApp();
  const navigate    = useNavigate();

  const [mode,    setMode   ] = useState('login'); // 'login' | 'register'
  const [form,    setForm   ] = useState({ name: '', email: '', password: '' });
  const [errors,  setErrors ] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (mode === 'register' && !form.name.trim())          e.name     = 'Name is required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
    if (form.password.length < 6)                          e.password = 'Min 6 characters';
    return e;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    setLoading(true);
    setTimeout(() => {
      login({ name: form.name || form.email.split('@')[0], email: form.email });
      navigate('/');
    }, 800);
  };

  const bindField = (field) => ({
    value: form[field],
    onChange: e => {
      setForm(p    => ({ ...p,    [field]: e.target.value }));
      setErrors(p  => ({ ...p,    [field]: ''             }));
    },
  });

  const handleSocial = (provider) => {
    login({ name: `${provider} User`, email: `user@${provider.toLowerCase()}.com` });
    navigate('/');
  };

  return (
    <div className="login-page">
      <div className="login-box">

        <Link to="/" className="login-box__logo">▶ SUPERMOVIE</Link>
        <h2 className="login-box__title">
          {mode === 'login' ? 'Welcome back' : 'Create account'}
        </h2>
        <p className="login-box__sub">
          {mode === 'login' ? 'Sign in to your account' : 'Start streaming today'}
        </p>

        <form onSubmit={handleSubmit} noValidate>
          {mode === 'register' && (
            <div className="login-box__field">
              <label>Name</label>
              <input type="text" placeholder="John Doe" {...bindField('name')} />
              {errors.name && <span className="login-box__error">{errors.name}</span>}
            </div>
          )}

          <div className="login-box__field">
            <label>Email</label>
            <input type="email" placeholder="you@example.com" {...bindField('email')} />
            {errors.email && <span className="login-box__error">{errors.email}</span>}
          </div>

          <div className="login-box__field">
            <label>Password</label>
            <input type="password" placeholder="••••••" {...bindField('password')} />
            {errors.password && <span className="login-box__error">{errors.password}</span>}
          </div>

          <button
            type="submit"
            className="btn btn-primary login-box__submit"
            disabled={loading}
          >
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="login-box__divider">or continue with</div>

        <div className="login-box__socials">
          {['Google', 'GitHub'].map(s => (
            <button
              key={s}
              className="btn btn-secondary login-box__social-btn"
              onClick={() => handleSocial(s)}
            >
              {s}
            </button>
          ))}
        </div>

        <p className="login-box__switch">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={() => setMode(m => m === 'login' ? 'register' : 'login')}>
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </button>
        </p>

      </div>
    </div>
  );
}
