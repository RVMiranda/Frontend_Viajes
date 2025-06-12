// src/components/RolForm.jsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate, useOutletContext } from 'react-router-dom'
import client from '../api/axiosClient'
import '../styles/Rol.css'

export default function RolForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { refresh } = useOutletContext()

  const [form, setForm]     = useState({ nombre: '' })
  const [loading, setLoading] = useState(!!id)
  const [error, setError]     = useState(null)

  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }
    client.get(`/roles/${id}/`)
      .then(({ data }) => setForm({ nombre: data.nombre }))
      .catch(err => {
        console.error(err)
        setError('No se pudo cargar el rol')
      })
      .finally(() => setLoading(false))
  }, [id])

  function handleChange(e) {
    setForm({ nombre: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      if (id) await client.patch(`/roles/${id}/`, form)
      else    await client.post('/roles/', form)
      refresh()
      navigate('/rol')
    } catch (err) {
      console.error(err)
      setError('Error guardando rol')
    }
  }

  if (loading) return <p className="du-mensaje">Cargando rol…</p>
  if (error)   return <p className="du-mensaje error">{error}</p>

  return (
    <div className="form-page">
      <h2 className="form-title">{id ? 'Editar Rol' : 'Nuevo Rol'}</h2>
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
        <div className="form-actions">
          <button type="submit">{id ? 'Guardar' : 'Crear'}</button>
          <button type="button" onClick={() => navigate('/rol')}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
