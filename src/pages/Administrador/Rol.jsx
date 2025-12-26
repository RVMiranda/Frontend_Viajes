// src/pages/Administrador/Rol.jsx
import { useEffect, useState } from 'react'
import { useNavigate, Outlet } from 'react-router-dom'
import client from '../../api/axiosClient'
import '../../styles/Rol.css'

export default function Rol() {
  const [roles, setRoles]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchRoles()
  }, [])

  async function fetchRoles() {
    try {
      setLoading(true)
      const { data } = await client.get('/roles/')
      setRoles(data)
    } catch (err) {
      console.error(err)
      setError('Error cargando roles.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <p className="du-mensaje">Cargando roles…</p>
  if (error)   return <p className="du-mensaje error">{error}</p>

  return (
    <div className="rol-page">
      <div className="rol-header">
        <h1>Gestión de Roles</h1>
        <button className="btn-new" onClick={() => navigate('form')}>
          + Nuevo Rol
        </button>
      </div>

      <table className="rol-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {roles.map(r => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.nombre}</td>
              <td>
                <button onClick={() => navigate(`form/${r.id}`)}>
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Outlet context={{ refresh: fetchRoles }} />
    </div>
  )
}
