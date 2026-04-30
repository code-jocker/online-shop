import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getToken, getUserType } from '../auth';

const s = {
  // Hero
  hero: {
    position: 'relative', overflow: 'hidden', minHeight: '88vh',
    background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4c1d95 70%, #7c3aed 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  heroBg1: {
    position: 'absolute', top: '-20%', right: '-10%',
    width: 600, height: 600,
    background: 'radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)',
    borderRadius: '50%', pointerEvents: 'none',
  },
  heroBg2: {
    position: 'absolute', bottom: '-25%', left: '-12%',
    width: 700, height: 700,
    background: 'radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)',
    borderRadius: '50%', pointerEvents: 'none',
  },
  heroBg3: {
    position: 'absolute', top: '30%', left: '50%',
    width: 400, height: 400,
    background: 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)',
    borderRadius: '50%', pointerEvents: 'none',
  },
  heroInner: {
    position: 'relative', zIndex: 1, textAlign: 'center',
    padding: '80px 24px', maxWidth: 780, margin: '0 auto',
  },
  badge: {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)',
    color: '#fbbf24', borderRadius: 100, padding: '6px 18px',
    fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.5px',
    marginBottom: 28, textTransform: 'uppercase',
  },
  badgeDot: {
    width: 7, height: 7, borderRadius: '50%', background: '#f59e0b',
    boxShadow: '0 0 6px #f59e0b',
  },
  heroH1: {
    fontSize: 'clamp(2.4rem, 6vw, 4rem)', fontWeight: 900,
    color: '#fff', lineHeight: 1.1, letterSpacing: '-2px',
    marginBottom: 24,
  },
  heroSpan: { color: '#f59e0b' },
  heroP: {
    color: 'rgba(255,255,255,0.75)', fontSize: '1.15rem',
    maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.8,
  },
  heroBtns: { display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' },
  btnPrimary: {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    background: '#f59e0b', color: '#1e1b4b',
    padding: '15px 36px', borderRadius: 100,
    fontWeight: 800, fontSize: '1rem', textDecoration: 'none',
    boxShadow: '0 8px 24px rgba(245,158,11,0.4)',
    transition: 'all 0.2s ease',
  },
  btnOutline: {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    background: 'rgba(255,255,255,0.08)', color: '#fff',
    border: '1.5px solid rgba(255,255,255,0.25)',
    padding: '15px 36px', borderRadius: 100,
    fontWeight: 700, fontSize: '1rem', textDecoration: 'none',
    backdropFilter: 'blur(8px)',
    transition: 'all 0.2s ease',
  },
  heroScroll: {
    position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
    color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', fontWeight: 600,
    letterSpacing: '1px', textTransform: 'uppercase',
  },
  scrollLine: {
    width: 1, height: 40,
    background: 'linear-gradient(to bottom, rgba(255,255,255,0.4), transparent)',
  },

  // Stats
  statsBar: {
    background: '#fff', borderBottom: '1px solid #e5e7eb',
    padding: '0 24px',
  },
  statsInner: {
    maxWidth: 1100, margin: '0 auto',
    display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
  },
  statItem: {
    padding: '28px 24px', textAlign: 'center',
    borderRight: '1px solid #f3f4f6',
  },
  statNum: {
    fontSize: '2rem', fontWeight: 900, color: '#7c3aed',
    letterSpacing: '-1px', lineHeight: 1,
  },
  statLabel: {
    fontSize: '0.8rem', color: '#6b7280', fontWeight: 600,
    marginTop: 6, textTransform: 'uppercase', letterSpacing: '0.5px',
  },

  // Section
  section: { padding: '80px 24px', maxWidth: 1100, margin: '0 auto' },
  sectionTag: {
    display: 'inline-block', background: '#ede9fe', color: '#7c3aed',
    fontSize: '0.75rem', fontWeight: 700, padding: '5px 14px',
    borderRadius: 100, textTransform: 'uppercase', letterSpacing: '0.8px',
    marginBottom: 14,
  },
  sectionH2: {
    fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', fontWeight: 900,
    color: '#111827', letterSpacing: '-1px', marginBottom: 14, lineHeight: 1.2,
  },
  sectionSub: {
    color: '#6b7280', fontSize: '1rem', maxWidth: 520, lineHeight: 1.7,
  },

  // Feature cards
  featuresGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: 24, marginTop: 48,
  },
  featureCard: {
    background: '#fff', borderRadius: 20, padding: '36px 32px',
    border: '1.5px solid #e5e7eb',
    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
    transition: 'all 0.3s ease', cursor: 'default',
  },
  featureIconWrap: {
    width: 60, height: 60, borderRadius: 16,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '1.8rem', marginBottom: 20,
  },
  featureH3: {
    fontSize: '1.1rem', fontWeight: 800, color: '#111827', marginBottom: 10,
  },
  featureP: { fontSize: '0.9rem', color: '#6b7280', lineHeight: 1.7 },
  featureLink: {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    color: '#7c3aed', fontWeight: 700, fontSize: '0.85rem',
    textDecoration: 'none', marginTop: 18,
  },

  // How it works
  howBg: { background: '#f9fafb', padding: '80px 24px' },
  stepsGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 32, marginTop: 48, maxWidth: 1100, margin: '48px auto 0',
  },
  stepCard: { textAlign: 'center', padding: '0 16px' },
  stepNum: {
    width: 52, height: 52, borderRadius: '50%',
    background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
    color: '#fff', fontWeight: 900, fontSize: '1.1rem',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    margin: '0 auto 20px',
    boxShadow: '0 8px 20px rgba(124,58,237,0.3)',
  },
  stepIcon: { fontSize: '2rem', marginBottom: 14, display: 'block' },
  stepH3: { fontSize: '1rem', fontWeight: 800, color: '#111827', marginBottom: 8 },
  stepP: { fontSize: '0.875rem', color: '#6b7280', lineHeight: 1.6 },

  // CTA
  ctaWrap: {
    background: 'linear-gradient(135deg, #1e1b4b 0%, #4c1d95 50%, #7c3aed 100%)',
    borderRadius: 24, padding: '72px 40px', textAlign: 'center',
    position: 'relative', overflow: 'hidden', margin: '0 24px 80px',
    maxWidth: 1100, marginLeft: 'auto', marginRight: 'auto',
  },
  ctaBg: {
    position: 'absolute', top: '-40%', right: '-5%',
    width: 500, height: 500,
    background: 'radial-gradient(circle, rgba(245,158,11,0.1) 0%, transparent 70%)',
    borderRadius: '50%', pointerEvents: 'none',
  },
  ctaH2: {
    fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900,
    color: '#fff', letterSpacing: '-1px', marginBottom: 16, position: 'relative', zIndex: 1,
  },
  ctaP: {
    color: 'rgba(255,255,255,0.7)', fontSize: '1.05rem',
    maxWidth: 480, margin: '0 auto 36px', lineHeight: 1.7, position: 'relative', zIndex: 1,
  },
  ctaBtns: {
    display: 'flex', gap: 14, justifyContent: 'center',
    flexWrap: 'wrap', position: 'relative', zIndex: 1,
  },

  // Footer
  footer: {
    background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
    borderTop: '1px solid rgba(255,255,255,0.08)',
    padding: '48px 24px 32px',
  },
  footerInner: {
    maxWidth: 1100, margin: '0 auto',
    display: 'grid', gridTemplateColumns: '1fr auto',
    gap: 32, alignItems: 'start',
  },
  footerBrand: {
    fontSize: '1.4rem', fontWeight: 900, color: '#fff',
    letterSpacing: '-0.5px', marginBottom: 8,
  },
  footerTagline: { color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem' },
  footerLinks: { display: 'flex', gap: 24, alignItems: 'center' },
  footerLink: {
    color: 'rgba(255,255,255,0.55)', textDecoration: 'none',
    fontSize: '0.875rem', fontWeight: 500, transition: 'color 0.2s',
  },
  footerBottom: {
    maxWidth: 1100, margin: '32px auto 0',
    paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.08)',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    flexWrap: 'wrap', gap: 12,
  },
  footerCredit: { color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' },
};

const features = [
  {
    icon: '🛒', color: '#ede9fe', title: 'Smart Shopping',
    desc: 'Browse thousands of products, compare prices, and place orders in seconds. Your cart is always saved.',
    link: '/register', linkText: 'Shop now',
  },
  {
    icon: '🏪', color: '#d1fae5', title: 'Seller Dashboard',
    desc: 'List products, manage inventory, track orders and grow your revenue with real-time analytics.',
    link: '/register', linkText: 'Start selling',
  },
  {
    icon: '⚙️', color: '#fee2e2', title: 'Admin Control',
    desc: 'Full platform oversight — manage users, approve orders, monitor shops and handle disputes.',
    link: '/login', linkText: 'Admin access',
  },
];

const steps = [
  { icon: '📝', num: '01', title: 'Create Account', desc: 'Sign up in under a minute. Choose your role — customer or seller.' },
  { icon: '🔍', num: '02', title: 'Browse Products', desc: 'Explore our catalog of products from verified sellers across all categories.' },
  { icon: '🛒', num: '03', title: 'Place Your Order', desc: 'Add to cart and checkout securely. Track your order in real time.' },
  { icon: '📦', num: '04', title: 'Fast Delivery', desc: 'Sellers confirm and ship your order. Get notified at every step.' },
];

const stats = [
  { num: '10K+', label: 'Happy Customers' },
  { num: '500+', label: 'Active Sellers' },
  { num: '25K+', label: 'Products Listed' },
  { num: '99%', label: 'Satisfaction Rate' },
];

export default function Home() {
  const token = getToken();
  const type = getUserType();

  function dashboardHref() {
    if (type === 'customer') return '/customer';
    if (type === 'seller') return '/seller';
    return '/dashboard';
  }

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      <Navbar active="home" />

      {/* ── Hero ── */}
      <section style={s.hero}>
        <div style={s.heroBg1} />
        <div style={s.heroBg2} />
        <div style={s.heroBg3} />
        <div style={s.heroInner}>
          <div style={s.badge}>
            <span style={s.badgeDot} />
            Now live — Shop smarter today
          </div>
          <h1 style={s.heroH1}>
            The Smarter Way<br />to <span style={s.heroSpan}>Shop & Sell</span>
          </h1>
          <p style={s.heroP}>
            Clever Store connects buyers and sellers on one powerful platform.
            Discover amazing products, manage your shop, and grow your business — all in one place.
          </p>
          <div style={s.heroBtns}>
            {token ? (
              <Link to={dashboardHref()} style={s.btnPrimary}>
                Go to Dashboard →
              </Link>
            ) : (
              <>
                <Link to="/register" style={s.btnPrimary}>Get Started Free →</Link>
                <Link to="/login" style={s.btnOutline}>Sign In</Link>
              </>
            )}
          </div>
        </div>
        <div style={s.heroScroll}>
          <div style={s.scrollLine} />
          scroll
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <div style={s.statsBar}>
        <div style={s.statsInner}>
          {stats.map((st, i) => (
            <div key={st.label} style={{ ...s.statItem, borderRight: i < stats.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
              <div style={s.statNum}>{st.num}</div>
              <div style={s.statLabel}>{st.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Features ── */}
      <div style={s.section}>
        <div style={s.sectionTag}>What we offer</div>
        <h2 style={s.sectionH2}>Everything you need,<br />in one platform</h2>
        <p style={s.sectionSub}>
          Whether you're here to shop or sell, Clever Store gives you the tools to do it better.
        </p>
        <div style={s.featuresGrid}>
          {features.map(f => (
            <div key={f.title}
              style={s.featureCard}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)'; e.currentTarget.style.borderColor = '#7c3aed'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)'; e.currentTarget.style.borderColor = '#e5e7eb'; }}
            >
              <div style={{ ...s.featureIconWrap, background: f.color }}>{f.icon}</div>
              <h3 style={s.featureH3}>{f.title}</h3>
              <p style={s.featureP}>{f.desc}</p>
              <Link to={f.link} style={s.featureLink}>{f.linkText} →</Link>
            </div>
          ))}
        </div>
      </div>

      {/* ── How it works ── */}
      <div style={s.howBg}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
          <div style={s.sectionTag}>How it works</div>
          <h2 style={s.sectionH2}>Up and running in 4 steps</h2>
          <p style={{ ...s.sectionSub, margin: '0 auto' }}>
            Getting started on Clever Store is fast, simple, and free.
          </p>
        </div>
        <div style={s.stepsGrid}>
          {steps.map((step, i) => (
            <div key={step.num} style={s.stepCard}>
              <span style={s.stepIcon}>{step.icon}</span>
              <div style={s.stepNum}>{step.num}</div>
              <h3 style={s.stepH3}>{step.title}</h3>
              <p style={s.stepP}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA ── */}
      <div style={{ padding: '80px 24px' }}>
        <div style={s.ctaWrap}>
          <div style={s.ctaBg} />
          <h2 style={s.ctaH2}>Ready to get started?</h2>
          <p style={s.ctaP}>
            Join thousands of customers and sellers already using Clever Store.
            Create your free account in seconds.
          </p>
          <div style={s.ctaBtns}>
            {token ? (
              <Link to={dashboardHref()} style={s.btnPrimary}>Go to Dashboard →</Link>
            ) : (
              <>
                <Link to="/register" style={s.btnPrimary}>Create Free Account →</Link>
                <Link to="/login" style={{ ...s.btnOutline, borderColor: 'rgba(255,255,255,0.3)' }}>Sign In</Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer style={s.footer}>
        <div style={s.footerInner}>
          <div>
            <div style={s.footerBrand}>Clever<span style={{ color: '#f59e0b' }}>Store</span></div>
            <div style={s.footerTagline}>Your premier online shopping destination</div>
          </div>
          <div style={s.footerLinks}>
            <Link to="/" style={s.footerLink}>Home</Link>
            <Link to="/login" style={s.footerLink}>Login</Link>
            <Link to="/register" style={s.footerLink}>Register</Link>
          </div>
        </div>
        <div style={s.footerBottom}>
          <span style={s.footerCredit}>© {new Date().getFullYear()} CleverStore. All rights reserved.</span>
          <span style={s.footerCredit}>Developed by Shyaka Clever</span>
        </div>
      </footer>
    </div>
  );
}
