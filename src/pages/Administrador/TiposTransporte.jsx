// src/pages/Administrador/TiposTransporte.jsx
import { useEffect, useState } from 'react'
import { useNavigate, Outlet } from 'react-router-dom'
import client from '../../api/axiosClient'
import '../../styles/TiposTransporte.css'

export default function TiposTransporte() {
  const [tipos, setTipos]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchTipos()
  }, [])

  async function fetchTipos() {
    try {
      setLoading(true)
      const { data } = await client.get('/tipos-transporte/')
      setTipos(data)
    } catch (err) {
      console.error(err)
      setError('Error cargando tipos de transporte.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <p className="du-mensaje">Cargando tipos…</p>
  if (error)   return <p className="du-mensaje error">{error}</p>

  return (
    <div className="tipos-transporte-page">
      <div className="tt-header">
        <h1>Gestión de Tipos de Transporte</h1>
        <button className="btn-new" onClick={() => navigate('form')}>
          + Nuevo Tipo
        </button>
      </div>

      <table className="tt-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {tipos.map(t => (
            <tr key={t.id}>
              <td>{t.nombre}</td>
              <td>{t.descripcion}</td>
              <td>
                <button onClick={() => navigate(`form/${t.id}`)}>
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Outlet context={{ refresh: fetchTipos }} />
    </div>
  )
}
