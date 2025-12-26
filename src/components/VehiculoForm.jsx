import { useState, useEffect } from 'react'
import { useParams, useNavigate, useOutletContext } from 'react-router-dom'
import client from '../api/axiosClient'
import '../styles/Vehiculos.css'

export default function VehiculoForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { refresh } = useOutletContext()

  const [tipos, setTipos]   = useState([])
  const [form, setForm]     = useState({
    tipo_transporte: '',
    capacidad_asientos: '',
    matricula: '',
    estado: true
  })
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    async function fetchAll() {
      try {
        // Carga catálogo de tipos
        const { data: tiposData } = await client.get('/tipos-transporte/')
        setTipos(tiposData)

        // Si editamos, carga el vehículo
        if (id) {
          const { data } = await client.get(`/vehiculos/${id}/`)
          setForm({
            tipo_transporte: data.tipo_transporte,
            capacidad_asientos: data.capacidad_asientos,
            matricula: data.matricula,
            estado: data.estado
          })
        }
      } catch (err) {
        console.error(err)
        setError('Error cargando datos')
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
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
      const payload = {
        tipo_transporte: form.tipo_transporte,
        capacidad_asientos: parseInt(form.capacidad_asientos, 10),
        matricula: form.matricula,
        estado: form.estado
      }
      if (id) await client.patch(`/vehiculos/${id}/`, payload)
      else    await client.post('/vehiculos/', payload)
      refresh()
      navigate('/vehiculos')
    } catch (err) {
      console.error(err)
      setError('Error guardando vehículo')
    }
  }

  if (loading) return <p className="du-mensaje">Cargando formulario…</p>
  if (error)   return <p className="du-mensaje error">{error}</p>

  return (
    <div className="form-page">
      <h2 className="form-title">{id ? 'Editar Vehículo' : 'Nuevo Vehículo'}</h2>
      <form onSubmit={handleSubmit} className="usuario-form">
        <label>
          Tipo de Transporte
          <select
            name="tipo_transporte"
            value={form.tipo_transporte}
            onChange={handleChange}
            required
          >
            <option value="">-- Selecciona Tipo --</option>
            {tipos.map(t => (
              <option key={t.id} value={t.id}>
                {t.nombre}
              </option>
            ))}
          </select>
        </label>

        <label>
          Capacidad de Asientos
          <input
            type="number"
            name="capacidad_asientos"
            value={form.capacidad_asientos}
            onChange={handleChange}
            min="1"
            required
          />
        </label>

        <label>
          Matrícula
          <input
            name="matricula"
            value={form.matricula}
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
          <button type="button" onClick={() => navigate('/vehiculos')}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
