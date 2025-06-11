import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login.jsx';
import Register from './pages/Registrarse.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Layout from './components/Layout.jsx';
import Usuarios from './pages/Usuarios.jsx';
import Viajes from './pages/Viajes.jsx';
import Destinos from './pages/Destinos.jsx';
import Vehiculos from './pages/Vehiculos.jsx';
import Rol from './pages/Rol.jsx';
import TipoTransporte from './pages/TiposTransporte.jsx';
import EstadoViaje from './pages/EstadoViaje.jsx';
import Pasajero from './pages/Pasajero.jsx';
import Pasajes from './pages/Pasajes.jsx';

export default function AppRouter() {
    return (
      <>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/registrarse" element={<Register />} />
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