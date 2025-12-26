// src/components/PasajeroForm.jsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate, useOutletContext } from 'react-router-dom'
import client from '../api/axiosClient'
import '../styles/Pasajeros.css'

export default function PasajeroForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { refresh } = useOutletContext()

  const [form, setForm] = useState({
    nombre_completo: '',
    documento_identidad: '',
    correo_electronico: '',
    telefono: '',
    estado: true
  })
  const [loading, setLoading] = useState(!!id)
  const [error, setError]     = useState(null)

  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }
    client.get(`/pasajeros/${id}/`)
      .then(({ data }) => setForm({
        nombre_completo: data.nombre_completo,
        documento_identidad: data.documento_identidad,
        correo_electronico: data.correo_electronico,
        telefono: data.telefono,
        estado: data.estado
      }))
      .catch(err => {
        console.error(err)
        setError('No se pudo cargar el pasajero')
      })
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
      if (id) await client.patch(`/pasajeros/${id}/`, form)
      else    await client.post('/pasajeros/', form)
      refresh()
      navigate('/pasajeros')
    } catch (err) {
      console.error(err)
      setError('Error guardando pasajero')
    }
  }

  if (loading) return <p className="du-mensaje">Cargando pasajero…</p>
  if (error)   return <p className="du-mensaje error">{error}</p>

  return (
    <div className="form-page">
      <h2 className="form-title">{id ? 'Editar Pasajero' : 'Nuevo Pasajero'}</h2>
      <form onSubmit={handleSubmit} className="usuario-form">
        <label>
          Nombre Completo
          <input
            name="nombre_completo"
            value={form.nombre_completo}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Documento de Identidad
          <input
            name="documento_identidad"
            value={form.documento_identidad}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Correo Electrónico
          <input
            name="correo_electronico"
            type="email"
            value={form.correo_electronico}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Teléfono
          <input
            name="telefono"
            type="tel"
            value={form.telefono}
            onChange={handleChange}
            required
          />
        </label>

        <label className="checkbox-label">
          <input
            name="estado"
            type="checkbox"
            checked={form.estado}
            onChange={handleChange}
          />
          Activo
        </label>

        <div className="form-actions">
          <button type="submit">{id ? 'Guardar' : 'Crear'}</button>
          <button type="button" onClick={() => navigate('/pasajeros')}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
