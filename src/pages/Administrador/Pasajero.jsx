// src/pages/Administrador/Pasajeros.jsx
import { useEffect, useState } from 'react'
import { useNavigate, Outlet } from 'react-router-dom'
import client from '../../api/axiosClient'
import '../../styles/Pasajeros.css'

export default function Pasajero() {
  const [pasajeros, setPasajeros] = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchPasajeros()
  }, [])

  async function fetchPasajeros() {
    try {
      setLoading(true)
      const { data } = await client.get('/pasajeros/')
      setPasajeros(data)
    } catch (err) {
      console.error(err)
      setError('Error cargando pasajeros.')
    } finally {
      setLoading(false)
    }
  }

  async function toggleEstado(p) {
    try {
      await client.patch(`/pasajeros/${p.id}/`, { estado: !p.estado })
      fetchPasajeros()
    } catch {
      setError('No se pudo actualizar estado.')
    }
  }

  if (loading) return <p className="du-mensaje">Cargando pasajeros…</p>
  if (error)   return <p className="du-mensaje error">{error}</p>

  return (
    <div className="pasajeros-page">
      <div className="pasajeros-header">
        <h1>Gestión de Pasajeros</h1>
        <button className="btn-new" onClick={() => navigate('form')}>
          + Nuevo Pasajero
        </button>
      </div>

      <table className="pasajeros-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Documento</th>
            <th>Correo</th>
            <th>Teléfono</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pasajeros.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.nombre_completo}</td>
              <td>{p.documento_identidad}</td>
              <td>{p.correo_electronico}</td>
              <td>{p.telefono}</td>
              <td>{p.estado ? 'Activo' : 'Inactivo'}</td>
              <td>
                <button onClick={() => navigate(`form/${p.id}`)}>Editar</button>
                <button onClick={() => toggleEstado(p)}>
                  {p.estado ? 'Desactivar' : 'Activar'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Outlet context={{ refresh: fetchPasajeros }} />
    </div>
  )
}
