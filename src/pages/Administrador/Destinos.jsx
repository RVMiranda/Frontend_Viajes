// src/pages/Administrador/Destinos.jsx
import { useEffect, useState } from 'react'
import { useNavigate, Outlet } from 'react-router-dom'
import client from '../../api/axiosClient'
import '../../styles/Destinos.css'

export default function Destinos() {
  const [destinos, setDestinos] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchDestinos()
  }, [])

  async function fetchDestinos() {
    try {
      setLoading(true)
      const { data } = await client.get('/destinos/')
      setDestinos(data)
    } catch (err) {
      console.error(err)
      setError('Error cargando destinos.')
    } finally {
      setLoading(false)
    }
  }

  async function toggleEstado(d) {
    try {
      await client.patch(`/destinos/${d.id}/`, { estado: !d.estado })
      fetchDestinos()
    } catch {
      setError('No se pudo actualizar estado.')
    }
  }

  if (loading) return <p className="du-mensaje">Cargando destinos…</p>
  if (error)   return <p className="du-mensaje error">{error}</p>

  return (
    <div className="destinos-page">
      <div className="destinos-header">
        <h1>Gestión de Destinos</h1>
        <button className="btn-new" onClick={() => navigate('form')}>
          + Nuevo Destino
        </button>
      </div>

      <table className="destinos-table">
        <thead>
          <tr>
            <th>Ciudad</th>
            <th>País</th>
            <th>Código</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {destinos.map(d => (
            <tr key={d.id}>
              <td>{d.ciudad}</td>
              <td>{d.pais}</td>
              <td>{d.codigo_terminal}</td>
              <td>{d.estado ? 'Activo' : 'Inactivo'}</td>
              <td>
                <button onClick={() => navigate(`form/${d.id}`)}>
                  Editar
                </button>
                <button onClick={() => toggleEstado(d)}>
                  {d.estado ? 'Desactivar' : 'Activar'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Aquí React Router montará DestinoForm */}
      <Outlet context={{ refresh: fetchDestinos }} />
    </div>
  )
}
