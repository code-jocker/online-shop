import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { login, getToken } from '../auth';


export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const registered = location.search.includes('registered=1');

  useEffect(() => { if (getToken()) navigate('/'); }, [navigate]);

  async function handleLogin(e) {
    e.preventDefault();
    if (!email || !password) { setError('Please enter email and password.'); return; }
    setLoading(true); setError('');
    try {
      const type = await login(email, password);
      if (type === 'customer') navigate('/customer');
      else if (type === 'seller') navigate('/seller');
      else navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally { setLoading(false); }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-box">
        <div className="auth-logo">Clever<span> store</span></div>
        <p className="auth-subtitle">Sign in to your account</p>

        {registered && (
          <div className="form-success" style={{ display: 'block' }}>✓ Account created successfully! You can now log in.</div>
        )}
        {error && <div className="form-error" style={{ display: 'block' }}>{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="form-group" style={{ marginBottom: 18 }}>
            <label>Email</label>
            <input type="text" placeholder="e.g. jane@example.com" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="form-group" style={{ marginBottom: 24 }}>
            <label>Password</label>
            <input type="password" placeholder="Your password" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <button className="btn btn-blue" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '14px 22px', fontSize: '1rem' }}>
            {loading ? <><span className="spinner"></span> Logging in...</> : 'Log In'}
          </button>
        </form>

        <div className="divider">or</div>
        <div className="auth-footer">Don't have an account? <Link to="/register">Create one</Link></div>
      </div>
    </div>
  );
}
