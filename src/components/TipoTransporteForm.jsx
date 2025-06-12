// src/components/TipoTransporteForm.jsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate, useOutletContext } from 'react-router-dom'
import client from '../api/axiosClient'
import '../styles/TiposTransporte.css'

export default function TipoTransporteForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { refresh } = useOutletContext()

  const [form, setForm]     = useState({ nombre: '', descripcion: '' })
  const [loading, setLoading] = useState(!!id)
  const [error, setError]     = useState(null)

  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }
    client.get(`/tipos-transporte/${id}/`)
      .then(({ data }) => setForm({
        nombre: data.nombre,
        descripcion: data.descripcion
      }))
      .catch(err => {
        console.error(err)
        setError('No se pudo cargar el tipo')
      })
      .finally(() => setLoading(false))
  }, [id])

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      if (id) await client.patch(`/tipos-transporte/${id}/`, form)
      else    await client.post('/tipos-transporte/', form)
      refresh()
      navigate('/tipos-transporte')
    } catch (err) {
      console.error(err)
      setError('Error guardando tipo')
    }
  }

  if (loading) return <p className="du-mensaje">Cargando tipo…</p>
  if (error)   return <p className="du-mensaje error">{error}</p>

  return (
    <div className="form-page">
      <h2 className="form-title">{id ? 'Editar Tipo' : 'Nuevo Tipo'}</h2>
      <form onSubmit={handleSubmit} className="usuario-form">
        <label>
          Nombre
          <input
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Descripción
          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            rows="3"
            required
          />
        </label>
        <div className="form-actions">
          <button type="submit">{id ? 'Guardar' : 'Crear'}</button>
          <button type="button" onClick={() => navigate('/tipos-transporte')}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
