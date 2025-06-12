import { NavLink } from 'react-router-dom'
import '../styles/Sidebar.css'

export default function Sidebar() {
  // 1) Recupera el rol del usuario
  const stored = localStorage.getItem('user')
  const role = stored ? JSON.parse(stored).rol.nombre : null

  // 2) Lista completa con permisos
  const sections = [
    { to: '/dashboard',      label: 'Dashboard',       allowedRoles: ['Administrador','Agente'] },
    { to: '/usuarios',       label: 'Usuarios',        allowedRoles: ['Administrador'] },
    { to: '/viajes',         label: 'Viajes',          allowedRoles: ['Administrador','Agente'] },
    { to: '/destinos',       label: 'Destinos',        allowedRoles: ['Administrador','Agente'] },
    { to: '/vehiculos',      label: 'Vehículos',       allowedRoles: ['Administrador'] },
    { to: '/rol',            label: 'Roles',           allowedRoles: ['Administrador'] },
    { to: '/tipotransporte', label: 'Tipos Transporte', allowedRoles: ['Administrador'] },
    { to: '/estadoviaje',    label: 'Estado Viaje',    allowedRoles: ['Administrador'] },
    { to: '/pasajero',       label: 'Pasajeros',       allowedRoles: ['Administrador','Agente'] },
    { to: '/pasajes',        label: 'Pasajes',         allowedRoles: ['Administrador','Agente'] },
    // DashboardUsuario dentro de /usuario/dashboard:
    { to: '/usuario/dashboard', label: 'Comprar Viaje', allowedRoles: ['Usuario'] },
    { to: '/usuario/mis-viajes', label: 'Mis Compras',   allowedRoles: ['Usuario'] },
    // puedes añadir rutas de restablecer, perfil, etc., según necesites
  ]

  // 3) Filtra según el rol actual
  const menu = sections.filter(sec =>
    sec.allowedRoles.includes(role)
  )

  return (
    <nav className="sidebar">
      <img src="/logo.png" alt="NahualTravel" className="sidebar-logo" />
      <h2 className="sidebar-title">Menú</h2>
      <ul className="sidebar-list">
        {menu.map(s => (
          <li key={s.to}>
            <NavLink
              to={s.to}
              className={({ isActive }) =>
                isActive ? 'sidebar-link active' : 'sidebar-link'
              }
            >
              {s.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}