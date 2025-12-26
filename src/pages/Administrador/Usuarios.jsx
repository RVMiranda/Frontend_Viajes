// src/pages/Administrador/Usuarios.jsx
import { useEffect, useState } from 'react'
import { useNavigate, Outlet } from 'react-router-dom'
import client from '../../api/axiosClient'
import '../../styles/Usuarios.css'

export default function Usuarios() {
  const [users, setUsers]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchUsers()
  }, [])

  async function fetchUsers() {
    try {
      setLoading(true)
      const { data } = await client.get('/usuarios/')
      // data es un arreglo de usuarios planos
      setUsers(data)
    } catch (err) {
      console.error(err)
      setError('Error cargando usuarios.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <p>Cargando usuarios...</p>
  if (error)   return <p className="error">{error}</p>

  return (
    <div className="usuarios-page">
      <div className="usuarios-header">
        <h1>Gestión de Usuarios</h1>
        <button
          className="btn-new"
          onClick={() => navigate('form')}
        >
          + Nuevo Usuario
        </button>
      </div>

      <table className="usuarios-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Rol</th>
            <th>Creación</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.nombre_usuario}</td>
              <td>{u.rol?.nombre ?? '—'}</td>
              <td>
                {new Date(u.fecha_creacion)
                  .toLocaleDateString('es-MX')}
              </td>
              <td>{u.estado ? 'Activo' : 'Inactivo'}</td>
              <td>
                <button
                  onClick={() => navigate(`form/${u.id}`)}
                >
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Aquí React Router cargará UsuarioForm para crear/editar */}
      <Outlet context={{ refresh: fetchUsers }} />
    </div>
  )
}
