import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';

export default function AppRouter() {
    return (
      <>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Redirige a login si no hay token */}
        </Routes>
      </>
    );
  }