import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Spinner from '../components/Spinner';
import { ToastContainer, useToast } from '../components/Toast';
import { api } from '../api';

export default function Customer() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [prodError, setProdError] = useState('');
  const [order, setOrder] = useState({ productId: '', quantity: 1, price: '' });
  const [orderError, setOrderError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState('');
  const [ordering, setOrdering] = useState(false);
  const { toasts, showToast } = useToast();

  useEffect(() => {
    api.getAllProducts()
      .then(data => { setProducts(Array.isArray(data) ? data : (data.products || data.data || [])); })
      .catch(() => setProdError('Failed to load products. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  function fillOrder(id, price) {
    setOrder(o => ({ ...o, productId: id, price }));
    document.getElementById('order-section').scrollIntoView({ behavior: 'smooth' });
  }

  async function submitOrder(e) {
    e.preventDefault();
    setOrderError(''); setOrderSuccess('');
    if (!order.productId || !order.quantity || isNaN(parseFloat(order.price))) {
      setOrderError('Product ID, quantity, and price are required.'); return;
    }
    setOrdering(true);
    try {
      await api.createOrder({ prodId: order.productId, quantity: parseInt(order.quantity), price: parseFloat(order.price) });
      setOrderSuccess('Order placed successfully! 🎉');
      setOrder({ productId: '', quantity: 1, price: '' });
    } catch (err) {
      setOrderError(err.message || 'Failed to place order. Please try again.');
    } finally { setOrdering(false); }
  }

  return (
    <>
      <Navbar active="dashboard" />
      <div className="page" style={{ maxWidth: 1000 }}>
        <div className="page-title">Product Catalog</div>
        <p className="page-sub">Browse available products and place your order</p>

        {loading && <Spinner />}
        {prodError && <p style={{ color: '#c53030', padding: '20px 0' }}>{prodError}</p>}

        {!loading && !prodError && (
          <div className="products-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(250px,1fr))', gap: 20, marginTop: 20 }}>
            {products.length === 0 ? (
              <p style={{ color: '#718096' }}>No products available.</p>
            ) : products.map(p => (
              <div className="product-card" key={p.id} style={{ background: '#fff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'all 0.3s ease', border: '2px solid transparent' }}>
                <div style={{ height: 160, background: 'linear-gradient(135deg,var(--primary-light),var(--secondary-light))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', color: 'var(--primary)' }}>📦</div>
                <div style={{ padding: 18, flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div className="product-name">{p.name || 'Untitled Product'}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--gray-600)', lineHeight: 1.5, marginBottom: 12, flex: 1 }}>{p.description || 'No description'}</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                    <span className="product-price">${p.price || '0.00'}</span>
                    <button className="btn btn-sm btn-blue" onClick={() => fillOrder(p.id, p.price)}>Order</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div id="order-section" style={{ marginTop: 32 }}>
          <div className="card">
            <div className="card-title">📦 Create Order</div>
            <p style={{ color: 'var(--gray-600)', fontSize: '0.85rem', marginBottom: 16 }}>Fill in the details below to place a new order.</p>

            {orderError && <div className="form-error" style={{ display: 'block', marginBottom: 14 }}>{orderError}</div>}
            {orderSuccess && <div className="form-success" style={{ display: 'block', background: '#f0fff4', border: '1px solid #9ae6b4', color: '#276749', borderRadius: 8, padding: '10px 14px', fontSize: '0.85rem', marginBottom: 14 }}>{orderSuccess}</div>}

            <form onSubmit={submitOrder} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="form-group full">
                <label>Product ID *</label>
                <input type="text" placeholder="Enter product UUID" value={order.productId} onChange={e => setOrder(o => ({ ...o, productId: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>Quantity *</label>
                <input type="number" min="1" value={order.quantity} onChange={e => setOrder(o => ({ ...o, quantity: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>Price *</label>
                <input type="number" placeholder="e.g. 49.99" min="0" step="0.01" value={order.price} onChange={e => setOrder(o => ({ ...o, price: e.target.value }))} />
              </div>
              <div className="form-group full">
                <button className="btn btn-green" disabled={ordering} style={{ width: '100%', justifyContent: 'center' }}>
                  {ordering ? <><span className="spinner"></span> Placing order…</> : 'Place Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer toasts={toasts} />
    </>
  );
}
