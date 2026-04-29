import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getToken, getUserType } from '../auth';

export default function Home() {
  const token = getToken();
  const type = getUserType();

  function dashboardHref() {
    if (type === 'customer') return '/customer';
    if (type === 'seller') return '/seller';
    return '/dashboard';
  }

  return (
    <>
      <Navbar active="home" />
      <main className="page">
        <div className="hero-landing">
          <h1>Welcome to <span>Clever store</span></h1>
          <p>Your premier online shopping destination. Discover amazing products, manage your shop, and enjoy seamless shopping experience with just a few clicks.</p>
          <div className="hero-btns">
            {token ? (
              <Link to={dashboardHref()} className="btn btn-blue">Go to Dashboard</Link>
            ) : (
              <>
                <Link to="/login" className="btn btn-blue">Log In</Link>
                <Link to="/register" className="btn btn-secondary">Create Account</Link>
              </>
            )}
          </div>
        </div>

        <div className="features-row">
          {[
            { icon: '🛒', title: 'For Customers', desc: 'Browse our extensive product catalog and place orders securely with just a few clicks. Fast delivery guaranteed.' },
            { icon: '🏪', title: 'For Sellers', desc: 'Create and manage your products, track orders, and grow your business with our powerful seller dashboard.' },
            { icon: '⚙️', title: 'For Admins', desc: 'Full control over users, products, shops, and orders across the entire platform with advanced tools.' },
          ].map(f => (
            <div className="feature-card" key={f.title}>
              <span className="feature-icon">{f.icon}</span>
              <div className="feature-title">{f.title}</div>
              <div className="feature-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </main>

      <footer>
        <div className="footer-brand">Clever<span>Store</span></div>
        <div className="footer-links">
          <Link to="/">Home</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
        <p>Your premier online shopping destination</p>
        <div className="footer-credit">Developed by shyaka clever</div>
      </footer>
    </>
  );
}
