import { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import Spinner from '../components/Spinner';
import { ToastContainer, useToast } from '../components/Toast';
import { api } from '../api';

const ORDER_BADGE = { confirmed: 'badge-confirmed', cancelled: 'badge-cancelled', shipped: 'badge-shipped', delivered: 'badge-delivered' };

function OrdersSection({ showToast }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    api.getAllOrders()
      .then(d => setOrders(Array.isArray(d) ? d : (d.orders || d.data || [])))
      .catch(() => setError('Failed to load orders.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  function changeStatus(id, status) {
    api.updateOrderStatus(id, status)
      .then(() => { showToast(`Order ${status}.`, 'success'); load(); })
      .catch(() => showToast('Failed to update order.', 'error'));
  }

  return (
    <div>
      <div className="page-title">Orders</div>
      <p className="page-sub">View and manage incoming orders</p>
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading && <Spinner />}
        {error && <p style={{ padding: 20, color: '#c53030' }}>{error}</p>}
        {!loading && !error && (
          orders.length === 0 ? (
            <div className="empty-state"><div>📦</div>No orders found.</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="orders-table">
                <thead><tr><th>Order ID</th><th>Product</th><th>Qty</th><th>Price</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
                <tbody>
                  {orders.map(o => {
                    const canAct = o.status === 'pending' || !o.status;
                    return (
                      <tr key={o.id}>
                        <td>{o.id ? o.id.slice(0, 8) + '…' : '—'}</td>
                        <td>{o.prodId ? o.prodId.slice(0, 8) + '…' : '—'}</td>
                        <td>{o.quantity || '—'}</td>
                        <td>${o.price || '—'}</td>
                        <td><span className={`badge ${ORDER_BADGE[o.status] || 'badge-pending'}`}>{o.status || 'pending'}</span></td>
                        <td>{o.orderDate ? new Date(o.orderDate).toLocaleDateString() : '—'}</td>
                        <td style={{ display: 'flex', gap: 6 }}>
                          {canAct ? (
                            <>
                              <button className="btn btn-green btn-sm" onClick={() => changeStatus(o.id, 'confirmed')}>Approve</button>
                              <button className="btn btn-red btn-sm" onClick={() => changeStatus(o.id, 'cancelled')}>Cancel</button>
                            </>
                          ) : <span style={{ color: 'var(--gray-400)', fontSize: '.8rem' }}>—</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>
    </div>
  );
}

function ProductForm({ showToast }) {
  const [form, setForm] = useState({ name: '', size: '', price: '', type: 'male', description: '', status: 'available' });
  const [error, setError] = useState(''); const [success, setSuccess] = useState(''); const [loading, setLoading] = useState(false);
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault(); setError(''); setSuccess('');
    if (!form.name || !form.size || isNaN(parseFloat(form.price))) { setError('Name, size, and price are required.'); return; }
    setLoading(true);
    try {
      await api.createProduct({ ...form, price: parseFloat(form.price) });
      setSuccess('Product created successfully!');
      setForm({ name: '', size: '', price: '', type: 'male', description: '', status: 'available' });
    } catch (err) { setError(err.message || 'Failed to create product.'); }
    finally { setLoading(false); }
  }

  return (
    <div>
      <div className="page-title">Create Product</div>
      <p className="page-sub">Add a new product to your catalog</p>
      <div className="card">
        {error && <div className="form-error" style={{ display: 'block', marginBottom: 14 }}>{error}</div>}
        {success && <div className="form-success" style={{ display: 'block', background: '#f0fff4', border: '1px solid #9ae6b4', color: '#276749', borderRadius: 8, padding: '10px 14px', fontSize: '.85rem', marginBottom: 14 }}>{success}</div>}
        <form onSubmit={submit} className="form-grid">
          <div className="form-group"><label>Name *</label><input placeholder="e.g. Running Shoes" value={form.name} onChange={set('name')} /></div>
          <div className="form-group"><label>Size *</label><input placeholder="e.g. 42, L, M" value={form.size} onChange={set('size')} /></div>
          <div className="form-group"><label>Price *</label><input type="number" placeholder="e.g. 49.99" min="0" step="0.01" value={form.price} onChange={set('price')} /></div>
          <div className="form-group"><label>Type *</label>
            <select value={form.type} onChange={set('type')}><option value="male">Male</option><option value="female">Female</option><option value="unisex">Unisex</option></select>
          </div>
          <div className="form-group full"><label>Description</label><input placeholder="Short product description" value={form.description} onChange={set('description')} /></div>
          <div className="form-group full"><label>Status *</label>
            <select value={form.status} onChange={set('status')}><option value="available">Available</option><option value="unvailable">Unavailable</option></select>
          </div>
          <div className="form-group full">
            <button className="btn btn-blue" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
              {loading ? <><span className="spinner"></span> Creating…</> : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ShopForm({ showToast }) {
  const [form, setForm] = useState({ name: '', description: '', contact: '', status: 'active' });
  const [error, setError] = useState(''); const [success, setSuccess] = useState(''); const [loading, setLoading] = useState(false);
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault(); setError(''); setSuccess('');
    if (!form.name || !form.contact) { setError('Shop name and contact are required.'); return; }
    setLoading(true);
    try {
      await api.createShop(form);
      setSuccess('Shop created successfully!');
      setForm({ name: '', description: '', contact: '', status: 'active' });
    } catch (err) { setError(err.message || 'Failed to create shop.'); }
    finally { setLoading(false); }
  }

  return (
    <div>
      <div className="page-title">Create Shop</div>
      <p className="page-sub">Register a new shop on the platform</p>
      <div className="card">
        {error && <div className="form-error" style={{ display: 'block', marginBottom: 14 }}>{error}</div>}
        {success && <div className="form-success" style={{ display: 'block', background: '#f0fff4', border: '1px solid #9ae6b4', color: '#276749', borderRadius: 8, padding: '10px 14px', fontSize: '.85rem', marginBottom: 14 }}>{success}</div>}
        <form onSubmit={submit} className="form-grid">
          <div className="form-group full"><label>Shop Name *</label><input placeholder="e.g. Kigali Fashion Store" value={form.name} onChange={set('name')} /></div>
          <div className="form-group full"><label>Description</label><input placeholder="What does your shop sell?" value={form.description} onChange={set('description')} /></div>
          <div className="form-group"><label>Contact *</label><input placeholder="e.g. +1234567890" value={form.contact} onChange={set('contact')} /></div>
          <div className="form-group"><label>Status *</label>
            <select value={form.status} onChange={set('status')}><option value="active">Active</option><option value="inactive">Inactive</option><option value="pending">Pending</option></select>
          </div>
          <div className="form-group full">
            <button className="btn btn-blue" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
              {loading ? <><span className="spinner"></span> Creating…</> : 'Create Shop'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function NotificationsSection({ showToast }) {
  const [notifs, setNotifs] = useState([]);

  const load = useCallback(() => {
    api.getNotifications()
      .then(d => setNotifs(Array.isArray(d) ? d : (d.notifications || d.data || [])))
      .catch(() => setNotifs([]));
  }, []);

  useEffect(() => { load(); const t = setInterval(load, 30000); return () => clearInterval(t); }, [load]);

  const unread = notifs.filter(n => !n.isRead && !n.read).length;

  function markRead(id) {
    api.markNotificationRead(id).then(() => setNotifs(ns => ns.map(n => n.id === id ? { ...n, isRead: true } : n)))
      .catch(() => showToast('Failed to mark read.', 'error'));
  }

  function markAllRead() {
    const unreadList = notifs.filter(n => !n.isRead && !n.read);
    Promise.all(unreadList.map(n => api.markNotificationRead(n.id))).then(() => { load(); showToast('All marked as read.', 'success'); });
  }

  function changeStatus(id, status) {
    api.updateOrderStatus(id, status).then(() => { showToast(`Order ${status}.`, 'success'); load(); })
      .catch(() => showToast('Failed to update order.', 'error'));
  }

  return (
    <div>
      <div className="page-title">Notifications</div>
      <p className="page-sub">Order alerts — approve or cancel directly from here</p>
      <div className="notif-panel">
        <div className="notif-header">
          <h3>🔔 Order Notifications {unread > 0 && <span className="sidebar-badge">{unread}</span>}</h3>
          <button className="btn btn-sm btn-gray" onClick={markAllRead}>Mark all read</button>
        </div>
        <div className="notif-list">
          {notifs.length === 0 ? (
            <div className="notif-empty">🎉 No notifications yet.</div>
          ) : notifs.map(n => {
            const isRead = n.isRead || n.read;
            const orderId = n.orderId || n.order_id || '';
            return (
              <div key={n.id} className={`notif-item ${isRead ? 'read' : 'unread'}`}>
                <div className="notif-dot"></div>
                <div className="notif-body">
                  <div className="notif-msg">{n.message || 'New order received'}</div>
                  <div className="notif-time">{n.createdAt ? new Date(n.createdAt).toLocaleString() : ''}</div>
                </div>
                <div className="notif-actions">
                  {!isRead && <button className="btn btn-sm btn-gray" onClick={() => markRead(n.id)}>✓</button>}
                  {orderId && <>
                    <button className="btn btn-sm btn-green" onClick={() => changeStatus(orderId, 'confirmed')}>Approve</button>
                    <button className="btn btn-sm btn-red" onClick={() => changeStatus(orderId, 'cancelled')}>Cancel</button>
                  </>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const SECTIONS = ['orders', 'products', 'shops', 'notifications'];
const LABELS = { orders: '📦 Orders', products: '🛍️ Create Product', shops: '🏪 Create Shop', notifications: '🔔 Notifications' };

export default function Seller() {
  const [active, setActive] = useState('orders');
  const { toasts, showToast } = useToast();

  return (
    <>
      <Navbar />
      <div className="dashboard-layout">
        <aside className="sidebar">
          <div className="sidebar-title">Seller Hub</div>
          {SECTIONS.map(s => (
            <button key={s} className={`sidebar-link ${active === s ? 'active' : ''}`} onClick={() => setActive(s)}>
              {LABELS[s]}
            </button>
          ))}
        </aside>
        <main className="dashboard-content">
          {active === 'orders' && <OrdersSection showToast={showToast} />}
          {active === 'products' && <ProductForm showToast={showToast} />}
          {active === 'shops' && <ShopForm showToast={showToast} />}
          {active === 'notifications' && <NotificationsSection showToast={showToast} />}
        </main>
      </div>
      <ToastContainer toasts={toasts} />
    </>
  );
}
