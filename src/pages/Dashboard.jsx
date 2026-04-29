import { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import Spinner from '../components/Spinner';
import { ToastContainer, useToast } from '../components/Toast';
import { api } from '../api';

const ORDER_BADGE = { confirmed: 'badge-confirmed', cancelled: 'badge-cancelled' };

function getInitials(name) {
  if (!name) return '?';
  const p = name.trim().split(' ');
  return (p[0][0] + (p[1] ? p[1][0] : '')).toUpperCase();
}

function getBadgeClass(type) {
  if (type === 'seller') return 'badge-seller';
  if (type === 'admin') return 'badge-admin';
  return 'badge-customer';
}

function Overview({ users, orders, notifs }) {
  const customers = users.filter(u => u.type === 'customer' || !u.type).length;
  const sellers = users.filter(u => u.type === 'seller').length;
  return (
    <div>
      <div className="page-title">Admin Dashboard</div>
      <p className="page-sub">Welcome back! Here's a quick overview.</p>
      <div className="stats-row">
        {[['Total Users', users.length], ['Customers', customers], ['Sellers', sellers], ['Total Orders', orders.length]].map(([label, val]) => (
          <div className="stat-card" key={label}><div className="stat-label">{label}</div><div className="stat-value">{val}</div></div>
        ))}
      </div>
      <div className="card" style={{ marginTop: 8 }}>
        <div className="card-title">🔔 Recent Notifications</div>
        {notifs.length === 0 ? <div className="notif-empty">🎉 No notifications yet.</div> : notifs.slice(0, 4).map(n => (
          <div key={n.id} className={`notif-item ${(n.isRead || n.read) ? 'read' : 'unread'}`}>
            <div className="notif-dot"></div>
            <div className="notif-body">
              <div className="notif-msg">{n.message || 'New order received'}</div>
              <div className="notif-time">{n.createdAt ? new Date(n.createdAt).toLocaleString() : ''}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function UsersSection({ users, onDelete }) {
  const [query, setQuery] = useState('');
  const filtered = users.filter(u => (u.fullName || '').toLowerCase().includes(query) || (u.email || '').toLowerCase().includes(query));
  return (
    <div>
      <div className="page-title">All Users</div>
      <p className="page-sub">Manage registered users</p>
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0f4f8', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="card-title" style={{ margin: 0 }}>Users</div>
          <input placeholder="Search…" value={query} onChange={e => setQuery(e.target.value.toLowerCase())} style={{ width: 200, margin: 0 }} />
        </div>
        {filtered.length === 0 ? (
          <div className="empty-state"><div>👤</div>No users found.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="users-table">
              <thead><tr><th>User</th><th>Email</th><th>Phone</th><th>Location</th><th>Type</th><th>Age</th><th>Actions</th></tr></thead>
              <tbody>
                {filtered.map(u => (
                  <tr key={u.id}>
                    <td><div className="user-info"><div className="avatar">{getInitials(u.fullName)}</div><span>{u.fullName || '—'}</span></div></td>
                    <td>{u.email || '—'}</td>
                    <td>{u.phoneNumber || '—'}</td>
                    <td>{u.location || '—'}</td>
                    <td><span className={`badge ${getBadgeClass(u.type)}`}>{u.type || 'customer'}</span></td>
                    <td>{u.age || '—'}</td>
                    <td><button className="btn btn-red btn-sm" onClick={() => onDelete(u.id)}>Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function OrdersSection({ showToast }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    api.getAllOrders()
      .then(d => setOrders(Array.isArray(d) ? d : (d.orders || d.data || [])))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  function changeStatus(id, status) {
    api.updateOrderStatus(id, status).then(() => { showToast(`Order ${status}.`, 'success'); load(); })
      .catch(() => showToast('Failed to update order.', 'error'));
  }

  return (
    <div>
      <div className="page-title">All Orders</div>
      <p className="page-sub">View and manage all orders</p>
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading && <Spinner />}
        {!loading && (
          orders.length === 0 ? <div className="empty-state"><div>📦</div>No orders found.</div> : (
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

function NotificationsSection({ showToast, onLoad }) {
  const [notifs, setNotifs] = useState([]);

  const load = useCallback(() => {
    api.getNotifications()
      .then(d => { const list = Array.isArray(d) ? d : (d.notifications || d.data || []); setNotifs(list); onLoad && onLoad(list); })
      .catch(() => {});
  }, [onLoad]);

  useEffect(() => { load(); const t = setInterval(load, 30000); return () => clearInterval(t); }, [load]);

  function markRead(id) {
    api.markNotificationRead(id).then(() => setNotifs(ns => ns.map(n => n.id === id ? { ...n, isRead: true } : n)))
      .catch(() => showToast('Failed to mark read.', 'error'));
  }

  function markAllRead() {
    const unread = notifs.filter(n => !n.isRead && !n.read);
    Promise.all(unread.map(n => api.markNotificationRead(n.id))).then(() => { load(); showToast('All marked as read.', 'success'); });
  }

  function changeStatus(id, status) {
    api.updateOrderStatus(id, status).then(() => { showToast(`Order ${status}.`, 'success'); load(); })
      .catch(() => showToast('Failed to update order.', 'error'));
  }

  const unread = notifs.filter(n => !n.isRead && !n.read).length;

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
          {notifs.length === 0 ? <div className="notif-empty">🎉 No notifications yet.</div> : notifs.map(n => {
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

const SECTIONS = ['overview', 'users', 'orders', 'notifications'];
const LABELS = { overview: '📊 Overview', users: '👥 Users', orders: '📦 Orders', notifications: '🔔 Notifications' };

export default function AdminDashboard() {
  const [active, setActive] = useState('overview');
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [notifs, setNotifs] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const { toasts, showToast } = useToast();
  const unreadCount = notifs.filter(n => !n.isRead && !n.read).length;

  useEffect(() => {
    api.getAllusers()
      .then(d => setUsers(Array.isArray(d) ? d : (d.users || d.data || [])))
      .catch(() => {})
      .finally(() => setUsersLoading(false));
    api.getAllOrders()
      .then(d => setOrders(Array.isArray(d) ? d : (d.orders || d.data || [])))
      .catch(() => {});
  }, []);

  function deleteUser(id) {
    if (!confirm('Delete this user?')) return;
    api.removeUser(id).then(() => { setUsers(u => u.filter(x => x.id !== id)); showToast('User deleted.', 'success'); })
      .catch(() => showToast('Failed to delete user.', 'error'));
  }

  return (
    <>
      <Navbar />
      <div className="dashboard-layout">
        <aside className="sidebar">
          <div className="sidebar-title">Admin Panel</div>
          {SECTIONS.map(s => (
            <button key={s} className={`sidebar-link ${active === s ? 'active' : ''}`} onClick={() => setActive(s)}>
              {LABELS[s]}
              {s === 'notifications' && unreadCount > 0 && <span className="sidebar-badge">{unreadCount}</span>}
            </button>
          ))}
        </aside>
        <main className="dashboard-content">
          {usersLoading && active === 'overview' ? <Spinner /> : (
            <>
              {active === 'overview' && <Overview users={users} orders={orders} notifs={notifs} />}
              {active === 'users' && <UsersSection users={users} onDelete={deleteUser} />}
              {active === 'orders' && <OrdersSection showToast={showToast} />}
              {active === 'notifications' && <NotificationsSection showToast={showToast} onLoad={setNotifs} />}
            </>
          )}
        </main>
      </div>
      <ToastContainer toasts={toasts} />
    </>
  );
}
