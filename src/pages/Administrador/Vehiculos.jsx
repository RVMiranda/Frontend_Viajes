import { useEffect, useState } from 'react'
import { useNavigate, Outlet } from 'react-router-dom'
import client from '../../api/axiosClient'
import '../../styles/Vehiculos.css'

export default function Vehiculos() {
  const [vehiculos, setVehiculos] = useState([])
  const [tipos, setTipos]         = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)
  const navigate = useNavigate()

  // Fetch vehicles + tipos-transporte
  async function fetchData() {
    try {
      setLoading(true)
      const [
        { data: vehiculosData },
        { data: tiposData }
      ] = await Promise.all([
        client.get('/vehiculos/'),
        client.get('/tipos-transporte/')
      ])
      setVehiculos(vehiculosData)
      setTipos(tiposData)
    } catch (err) {
      console.error(err)
      setError('Error cargando vehículos.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  async function toggleEstado(v) {
    try {
      await client.patch(`/vehiculos/${v.id}/`, { estado: !v.estado })
      fetchData()
    } catch (err) {
      console.error(err)
      setError('No se pudo actualizar estado.')
    }
  }

  if (loading) return <p className="du-mensaje">Cargando vehículos…</p>
  if (error)   return <p className="du-mensaje error">{error}</p>

  return (
    <div className="vehiculos-page">
      <div className="vehiculos-header">
        <h1>Gestión de Vehículos</h1>
        <button
          className="btn-new"
          onClick={() => navigate('form')}
        >
          + Nuevo Vehículo
        </button>
      </div>

      <table className="vehiculos-table">
        <thead>
          <tr>
            <th>Matrícula</th>
            <th>Tipo</th>
            <th>Capacidad</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {vehiculos.map(v => {
            const tipo = tipos.find(t => t.id === v.tipo_transporte)
            return (
              <tr key={v.id}>
                <td>{v.matricula}</td>
                <td>{tipo?.nombre ?? '—'}</td>
                <td>{v.capacidad_asientos}</td>
                <td>{v.estado ? 'Activo' : 'Inactivo'}</td>
                <td>
                  <button onClick={() => navigate(`form/${v.id}`)}>
                    Editar
                  </button>
                  <button onClick={() => toggleEstado(v)}>
                    {v.estado ? 'Desactivar' : 'Activar'}
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      {/* Renderiza VehiculoForm para crear/editar */}
      <Outlet context={{ refresh: fetchData }} />
    </div>
  )
}
