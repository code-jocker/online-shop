const API_URL = 'http://localhost:5000/api';

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

const jsonHeaders = () => ({
  'Content-Type': 'application/json',
  ...authHeaders(),
});

async function req(url, opts = {}) {
  const res = await fetch(API_URL + url, opts);
  if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.message || 'Request failed'); }
  return res.json();
}

export const api = {
  getAllusers: () => req('/getAllUsers', { headers: authHeaders() }),
  removeUser: (id) => req(`/deleteUser/${id}`, { method: 'DELETE', headers: authHeaders() }),
  getAllProducts: () => req('/getAllProducts', { headers: authHeaders() }),
  createProduct: (d) => req('/createProduct', { method: 'POST', headers: jsonHeaders(), body: JSON.stringify(d) }),
  createOrder: (d) => req('/createOrder', { method: 'POST', headers: jsonHeaders(), body: JSON.stringify(d) }),
  getAllOrders: () => req('/getAllOrders', { headers: authHeaders() }),
  getAllShops: () => req('/getAllShops', { headers: authHeaders() }),
  createShop: (d) => req('/createShop', { method: 'POST', headers: jsonHeaders(), body: JSON.stringify(d) }),
  getNotifications: () => req('/notifications/all', { headers: authHeaders() }),
  markNotificationRead: (id) => req(`/notifications/${id}/read`, { method: 'PATCH', headers: authHeaders() }),
  updateOrderStatus: (id, status) => req(`/updateOrder/${id}`, { method: 'PUT', headers: jsonHeaders(), body: JSON.stringify({ status }) }),
};
