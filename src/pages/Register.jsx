import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register, getToken } from '../auth';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', password: '', phoneNumber: '', location: '', gender: '', age: '', date_of_birth: '', type: 'customer' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (getToken()) navigate('/'); }, [navigate]);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  async function handleRegister(e) {
    e.preventDefault();
    const { fullName, email, password, phoneNumber, location, gender, age, date_of_birth } = form;
    if (!fullName || !email || !password || !phoneNumber || !location || !gender || !age || !date_of_birth) {
      setError('All fields are required.'); return;
    }
    if (password.length < 4) { setError('Password must be at least 4 characters.'); return; }
    setLoading(true); setError('');
    try {
      await register({ ...form, age: parseInt(form.age, 10) });
      navigate('/login?registered=1');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally { setLoading(false); }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-box">
        <div className="auth-logo">Clever <span>store</span></div>
        <p className="auth-subtitle">Create your account to get started</p>

        {error && <div className="form-error" style={{ display: 'block' }}>{error}</div>}

        <form onSubmit={handleRegister}>
          {[
            { label: 'Full Name *', key: 'fullName', type: 'text', placeholder: 'e.g. John Felix' },
            { label: 'Email *', key: 'email', type: 'email', placeholder: 'jane@example.com' },
            { label: 'Phone Number *', key: 'phoneNumber', type: 'tel', placeholder: '+1234567890' },
            { label: 'Location *', key: 'location', type: 'text', placeholder: 'e.g. Kigali' },
            { label: 'Age *', key: 'age', type: 'number', placeholder: 'e.g. 25' },
            { label: 'Date of Birth *', key: 'date_of_birth', type: 'date' },
          ].map(f => (
            <div className="form-group" style={{ marginBottom: 16 }} key={f.key}>
              <label>{f.label}</label>
              <input type={f.type} placeholder={f.placeholder} value={form[f.key]} onChange={set(f.key)} min={f.type === 'number' ? 1 : undefined} />
            </div>
          ))}

          <div className="form-group" style={{ marginBottom: 16 }}>
            <label>Gender *</label>
            <select value={form.gender} onChange={set('gender')}>
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 16 }}>
            <label>Account Type *</label>
            <select value={form.type} onChange={set('type')}>
              <option value="customer">Customer</option>
              <option value="seller">Seller</option>
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 24 }}>
            <label>Password *</label>
            <input type="password" placeholder="Min 4 characters" value={form.password} onChange={set('password')} />
          </div>

          <button className="btn btn-blue" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '14px 22px', fontSize: '1rem' }}>
            {loading ? <><span className="spinner"></span> Creating account...</> : 'Create Account'}
          </button>
        </form>

        <div className="divider">or</div>
        <div className="auth-footer">Already have an account? <Link to="/login">Log in</Link></div>
      </div>
    </div>
  );
}
