// src/components/EstadoViajeForm.jsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate, useOutletContext } from 'react-router-dom'
import client from '../api/axiosClient'
import '../styles/EstadoViaje.css'

export default function EstadoViajeForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { refresh } = useOutletContext()

  const [form, setForm]       = useState({ descripcion: '' })
  const [loading, setLoading] = useState(!!id)
  const [error, setError]     = useState(null)

  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }
    client.get(`/estados-viaje/${id}/`)
      .then(({ data }) => setForm({ descripcion: data.descripcion }))
      .catch(err => {
        console.error(err)
        setError('No se pudo cargar el estado')
      })
      .finally(() => setLoading(false))
  }, [id])

  function handleChange(e) {
    setForm({ descripcion: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      if (id) await client.patch(`/estados-viaje/${id}/`, form)
      else    await client.post('/estados-viaje/', form)
      refresh()
      navigate('/estadoviaje')
    } catch (err) {
      console.error(err)
      setError('Error guardando estado')
    }
  }

  if (loading) return <p className="du-mensaje">Cargando estado…</p>
  if (error)   return <p className="du-mensaje error">{error}</p>

  return (
    <div className="form-page">
      <h2 className="form-title">{id ? 'Editar Estado' : 'Nuevo Estado'}</h2>
      <form onSubmit={handleSubmit} className="usuario-form">
        <label>
          Descripción
          <input
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            required
          />
        </label>
        <div className="form-actions">
          <button type="submit">{id ? 'Guardar' : 'Crear'}</button>
          <button type="button" onClick={() => navigate('/estadoviaje')}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
