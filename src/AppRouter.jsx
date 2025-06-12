import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Auth/Login.jsx';
import Register from './pages/Auth/Registrarse.jsx';
import Dashboard from './pages/Administrador/Dashboard.jsx';
import Layout from './components/Layout.jsx';
import Usuarios from './pages/Administrador/Usuarios.jsx';
import UsuarioForm from './components/UsuarioForm.jsx';
import Viajes from './pages/Administrador/Viajes.jsx';
import Destinos from './pages/Administrador/Destinos.jsx';
import Vehiculos from './pages/Administrador/Vehiculos.jsx';
import Rol from './pages/Administrador/Rol.jsx';
import RolForm from './components/RolForm.jsx';
import EstadoViaje from './pages/Administrador/EstadoViaje.jsx';
import EstadoViajeForm from './components/EstadoViajeForm.jsx';
import Pasajero from './pages/Administrador/Pasajero.jsx';
import PasajeroForm from './components/PasajeroForm.jsx';
import Pasajes from './pages/Administrador/Pasajes.jsx';
import PasajeForm from './components/PasajeForm.jsx';
import Restablecer from './pages/Auth/Restablecer.jsx';
import ViajeForm from './components/ViajeForm.jsx';
import DashboardUsuario from './pages/Usuario/Dashboard.jsx';
import DestinoForm from './components/DestinoForm.jsx';
import VehiculoForm from './components/VehiculoForm.jsx';
import TipoTransporteForm from './components/TipoTransporteForm.jsx';
import TiposTransporte from './pages/Administrador/TiposTransporte.jsx';

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
            {/* Usuarios con rutas hijas */}
            <Route path="usuarios" element={<Usuarios />}>
            {/* /usuarios/form  para crear */}
            <Route path="form" element={<UsuarioForm />} />
            {/* /usuarios/form/:id para editar */}
            <Route path="form/:id" element={<UsuarioForm />} />
            </Route>

            <Route path="viajes" element={<Viajes />}>
              <Route path="form" element={<ViajeForm />} />
              <Route path="form/:id" element={<ViajeForm />} />
            </Route>

            <Route path="tipotransporte" element={<TiposTransporte />}>
              <Route path="form" element={<TipoTransporteForm />} />
              <Route path="form/:id" element={<TipoTransporteForm />} />
            </Route>

            <Route path="destinos" element={<Destinos />}>
              <Route path="form" element={<DestinoForm />} />
              <Route path="form/:id" element={<DestinoForm />} />
            </Route>

            <Route path="vehiculos" element={<Vehiculos />}>
              <Route path="form" element={<VehiculoForm />} />
              <Route path="form/:id" element={<VehiculoForm />} />
            </Route>

            <Route path="rol" element={<Rol />}>
              <Route path="form" element={<RolForm />} />
              <Route path="form/:id" element={<RolForm />} />
            </Route>

            <Route path="estadoviaje" element={<EstadoViaje />}>
              <Route path="form" element={<EstadoViajeForm />} />
              <Route path="form/:id" element={<EstadoViajeForm />} />
            </Route>

            <Route path="pasajeros" element={<Pasajero />}>
              <Route path="form" element={<PasajeroForm />} />
              <Route path="form/:id" element={<PasajeroForm />} />
            </Route>

            <Route path="pasajes" element={<Pasajes />}>
              <Route path="form" element={<PasajeForm />} />
              <Route path="form/:id" element={<PasajeForm />} />
            </Route>

            {/* <Route path="metodopago" element={<MetodoPago />} />
            <Route path="estatuspasaje" element={<EstatusPasaje />} /> */}

            {/* Rutas de usuario */}
            <Route path="usuarios" element={<Usuarios />}>
              <Route path="form" element={<UsuarioForm />} />
              <Route path="form/:id" element={<UsuarioForm />} />
            </Route>
            {/* Puedes añadir más rutas de usuario aquí */}
          </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </>
    );
  }