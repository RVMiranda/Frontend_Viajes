import { NavLink } from 'react-router-dom'
import '../styles/Sidebar.css'

export default function Sidebar() {
    const sections = [
        { to: '/dashboard', label: 'Dashboard' },
        { to: '/usuarios', label: 'Usuarios' },
        { to: '/viajes', label: 'Viajes' },
        { to: '/destinos', label: 'Destinos' },
        { to: '/vehiculos', label: 'Vehículos' },
        { to: '/rol', label: 'Roles' },
        { to: '/tipotransporte', label: 'Tipos Transporte' },
        { to: '/estadoviaje', label: 'Estado Viaje' },
        { to: '/pasajero', label: 'Pasajeros' },
        { to: '/pasajes', label: 'Pasajes' },
        { to: '/metodopago', label: 'Métodos Pago' },
        { to: '/estatuspasaje', label: 'Estatus Pasaje' },
    ]

    return (
        <nav className="sidebar">
        <h2 className="sidebar-title">Menú</h2>
        <ul className="sidebar-list">
            {sections.map(s => (
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