import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { getToken, getUserType } from './auth';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Customer from './pages/Customer';
import Seller from './pages/Seller';
import Dashboard from './pages/Dashboard';

function PrivateRoute({ children, role }) {
  const token = getToken();
  const type = getUserType();
  if (!token) return <Navigate to="/login" replace />;
  if (role && type !== role && !(role === 'seller' && type === 'admin')) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/customer" element={<PrivateRoute role="customer"><Customer /></PrivateRoute>} />
        <Route path="/seller" element={<PrivateRoute role="seller"><Seller /></PrivateRoute>} />
        <Route path="/dashboard" element={<PrivateRoute role="admin"><Dashboard /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
