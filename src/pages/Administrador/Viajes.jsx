// src/pages/Administrador/Viajes.jsx
import { useEffect, useState } from 'react'
import { useNavigate, Outlet } from 'react-router-dom'
import client from '../../api/axiosClient'
import '../../styles/Viajes.css'

export default function Viajes() {
  const [viajes, setViajes]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchViajes()
  }, [])

  async function fetchViajes() {
    try {
      setLoading(true)
      const { data } = await client.get('/viajes/')
      setViajes(data)
    } catch (err) {
      console.error(err)
      setError('Error cargando viajes.')
    } finally {
      setLoading(false)
    }
  }

  async function toggleEstado(v) {
    try {
      await client.patch(`/viajes/${v.id}/`, { estado: !v.estado })
      fetchViajes()
    } catch (err) {
      console.error(err)
      setError('No se pudo actualizar estado.')
    }
  }

  if (loading) return <p className="du-mensaje">Cargando viajes…</p>
  if (error)   return <p className="du-mensaje">{error}</p>

  return (
    <div className="viajes-page">
      <div className="du-filtros">
        <button 
          className="btn-new" 
          onClick={() => navigate('form')}
        >
          + Nuevo Viaje
        </button>
      </div>

      <div className="du-list">
        {viajes.map(v => (
          <div key={v.id} className="du-card">
            <div>
              <strong>Origen:</strong> {v.origen.ciudad} – {v.origen.codigo_terminal}<br/>
              <strong>Destino:</strong> {v.destino.ciudad} – {v.destino.codigo_terminal}<br/>
              <strong>Vehículo:</strong> {v.vehiculo.matricula}<br/>
              <strong>Salida:</strong> {new Date(v.fecha_hora_salida).toLocaleString('es-MX')}<br/>
              <strong>Llegada:</strong> {new Date(v.fecha_hora_llegada).toLocaleString('es-MX')}<br/>
              <strong>Precio:</strong> ${parseFloat(v.precio_base).toLocaleString('es-MX')}<br/>
              <strong>Estado:</strong> {v.estado_viaje.descripcion}
            </div>
            <div className="du-actions">
              <button onClick={() => navigate(`form/${v.id}`)}>
                Editar
              </button>
              <button onClick={() => toggleEstado(v)}>
                {v.estado ? 'Desactivar' : 'Activar'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Aquí se renderizará el formulario para crear/editar */}
      <Outlet context={{ refresh: fetchViajes }} />
    </div>
  )
}
