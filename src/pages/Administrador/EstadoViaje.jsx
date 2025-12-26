// src/pages/Administrador/EstadoViaje.jsx
import { useEffect, useState } from 'react'
import { useNavigate, Outlet } from 'react-router-dom'
import client from '../../api/axiosClient'
import '../../styles/EstadoViaje.css'

export default function EstadoViaje() {
  const [estados, setEstados] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchEstados()
  }, [])

  async function fetchEstados() {
    try {
      setLoading(true)
      const { data } = await client.get('/estados-viaje/')
      setEstados(data)
    } catch (err) {
      console.error(err)
      setError('Error cargando estados de viaje.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <p className="du-mensaje">Cargando estados…</p>
  if (error)   return <p className="du-mensaje error">{error}</p>

  return (
    <div className="estado-viaje-page">
      <div className="ev-header">
        <h1>Gestión de Estados de Viaje</h1>
        <button className="btn-new" onClick={() => navigate('form')}>
          + Nuevo Estado
        </button>
      </div>

      <table className="ev-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {estados.map(ev => (
            <tr key={ev.id}>
              <td>{ev.id}</td>
              <td>{ev.descripcion}</td>
              <td>
                <button onClick={() => navigate(`form/${ev.id}`)}>
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Outlet context={{ refresh: fetchEstados }} />
    </div>
  )
}
