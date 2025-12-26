// src/components/DestinoForm.jsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate, useOutletContext } from 'react-router-dom'
import client from '../api/axiosClient'
import '../styles/Destinos.css'

export default function DestinoForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { refresh } = useOutletContext()

  const [form, setForm] = useState({
    ciudad: '',
    pais: '',
    codigo_terminal: '',
    estado: true
  })
  const [loading, setLoading] = useState(!!id)
  const [error, setError]     = useState(null)

  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }
    client.get(`/destinos/${id}/`)
      .then(({ data }) => setForm({
        ciudad: data.ciudad,
        pais: data.pais,
        codigo_terminal: data.codigo_terminal,
        estado: data.estado
      }))
      .catch(() => setError('No se pudo cargar el destino'))
      .finally(() => setLoading(false))
  }, [id])

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      const payload = { ...form }
      if (id) await client.patch(`/destinos/${id}/`, payload)
      else    await client.post('/destinos/', payload)
      refresh()
      navigate('/destinos')
    } catch {
      setError('Error guardando destino')
    }
  }

  if (loading) return <p className="du-mensaje">Cargando destino…</p>
  if (error)   return <p className="du-mensaje error">{error}</p>

  return (
    <div className="form-page">
      <h2 className="form-title">{id ? 'Editar Destino' : 'Nuevo Destino'}</h2>
      <form onSubmit={handleSubmit} className="usuario-form">
        <label>
          Ciudad
          <input
            name="ciudad"
            value={form.ciudad}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          País
          <input
            name="pais"
            value={form.pais}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Código Terminal
          <input
            name="codigo_terminal"
            value={form.codigo_terminal}
            onChange={handleChange}
            required
          />
        </label>

        <label className="checkbox-label">
          <input
            type="checkbox"
            name="estado"
            checked={form.estado}
            onChange={handleChange}
          />
          Activo
        </label>

        <div className="form-actions">
          <button type="submit">{id ? 'Guardar' : 'Crear'}</button>
          <button type="button" onClick={() => navigate('/destinos')}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
