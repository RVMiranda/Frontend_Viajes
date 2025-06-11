import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Auth/Login.jsx';
import Register from './pages/Auth/Registrarse.jsx';
import Dashboard from './pages/Administrador/Dashboard.jsx';
import Layout from './components/Layout.jsx';
import Usuarios from './pages/Administrador/Usuarios.jsx';
import Viajes from './pages/Administrador/Viajes.jsx';
import Destinos from './pages/Administrador/Destinos.jsx';
import Vehiculos from './pages/Administrador/Vehiculos.jsx';
import Rol from './pages/Administrador/Rol.jsx';
import TipoTransporte from './pages/Administrador/TiposTransporte.jsx';
import EstadoViaje from './pages/Administrador/EstadoViaje.jsx';
import Pasajero from './pages/Administrador/Pasajero.jsx';
import Pasajes from './pages/Administrador/Pasajes.jsx';
import Restablecer from './pages/Auth/Restablecer.jsx';

export default function AppRouter() {
    return (
      <>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/registrarse" element={<Register />} />
          <Route path="/restablecer" element={<Restablecer />} />
          {/* Redirige a login si no hay token */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="usuarios" element={<Usuarios />} />
            <Route path="viajes" element={<Viajes />} />
            <Route path="destinos" element={<Destinos />} />
            <Route path="vehiculos" element={<Vehiculos />} />
            <Route path="rol" element={<Rol />} />
            <Route path="tipotransporte" element={<TipoTransporte />} />
            <Route path="estadoviaje" element={<EstadoViaje />} />
            <Route path="pasajero" element={<Pasajero />} />
            <Route path="pasajes" element={<Pasajes />} />
            {/* <Route path="metodopago" element={<MetodoPago />} />
            <Route path="estatuspasaje" element={<EstatusPasaje />} /> */}
          </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </>
    );
  }