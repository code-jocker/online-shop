import { Link, useNavigate } from 'react-router-dom';
import { getUser, getToken, clearAuth, getUserType } from '../auth';

export default function Navbar({ active }) {
  const navigate = useNavigate();
  const user = getUser();
  const token = getToken();

  function logout() {
    clearAuth();
    navigate('/login');
  }

  function dashboardLink() {
    const t = getUserType();
    if (t === 'customer') return '/customer';
    if (t === 'seller') return '/seller';
    return '/dashboard';
  }

  return (
    <nav className="navbar">
      <Link className="navbar-logo" to="/">Clever <span>Store</span></Link>
      <div className="navbar-links">
        <Link to="/" className={active === 'home' ? 'active' : ''}>Home</Link>
        {user && token && (
          <Link to={dashboardLink()} className={active === 'dashboard' ? 'active' : ''}>Dashboard</Link>
        )}
      </div>
      <div>
        {user && token ? (
          <span>
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', marginRight: 6 }}>
              Hi, <strong style={{ color: '#68d391' }}>{user.email}</strong>
            </span>
            <button className="btn btn-sm" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none' }} onClick={logout}>
              Log Out
            </button>
          </span>
        ) : (
          <Link to="/login" className="btn btn-sm btn-blue">Log In</Link>
        )}
      </div>
    </nav>
  );
}
