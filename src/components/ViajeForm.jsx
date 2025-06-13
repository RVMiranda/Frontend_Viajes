// src/components/ViajeForm.jsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate, useOutletContext } from 'react-router-dom'
import client from '../api/axiosClient'
import '../styles/Viajes.css'

export default function ViajeForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { refresh } = useOutletContext()

  const [form, setForm] = useState({
    origen: '',
    destino: '',
    vehiculo: '',
    fecha_hora_salida: '',
    fecha_hora_llegada: '',
    precio_base: '',
    estado_viaje: '',
    estado: true
  })

  const [catalogos, setCatalogos] = useState({
    origenes: [],
    destinos: [],
    vehiculos: [],
    estados: []
  })

  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    async function fetchAll() {
      try {
        const [
          { data: origenes },
          { data: destinos },
          { data: vehiculos },
          { data: estados }
        ] = await Promise.all([
          client.get('/destinos/'),
          client.get('/destinos/'),
          client.get('/vehiculos/'),
          client.get('/estados-viaje/')
        ])

        setCatalogos({ origenes, destinos, vehiculos, estados })

        if (id) {
          const { data } = await client.get(`/viajes/${id}/`)
          setForm({
            origen: data.origen.id,
            destino: data.destino.id,
            vehiculo: data.vehiculo.id,
            fecha_hora_salida: data.fecha_hora_salida.slice(0,16),
            fecha_hora_llegada: data.fecha_hora_llegada.slice(0,16),
            precio_base: data.precio_base,
            estado_viaje: data.estado_viaje.id,
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
        origen_id: form.origen,
        destino_id: form.destino,
        vehiculo_id: form.vehiculo,
        estado_viaje_id: form.estado_viaje,
        fecha_hora_salida: new Date(form.fecha_hora_salida).toISOString(),
        fecha_hora_llegada: new Date(form.fecha_hora_llegada).toISOString(),
        precio_base: form.precio_base,
        estado: form.estado
      }

      if (id) await client.patch(`/viajes/${id}/`, payload)
      else    await client.post('/viajes/', payload)

      refresh()
      navigate('/viajes')
    } catch (err) {
      console.error(err)
      setError('Error guardando viaje')
    }
  }

  if (loading) return <p className="du-mensaje">Cargando formulario…</p>
  if (error)   return <p className="du-mensaje error">{error}</p>

  return (
    <div className="form-page">
      <h2 className="form-title">{id ? 'Editar Viaje' : 'Nuevo Viaje'}</h2>
      <form onSubmit={handleSubmit} className="usuario-form">
        <label>
          Origen
          <select
            name="origen"
            value={form.origen}
            onChange={handleChange}
            required
          >
            <option value="">-- Selecciona Origen --</option>
            {catalogos.origenes.map(o => (
              <option key={o.id} value={o.id}>
                {o.ciudad} ({o.codigo_terminal})
              </option>
            ))}
          </select>
        </label>

        <label>
          Destino
          <select
            name="destino"
            value={form.destino}
            onChange={handleChange}
            required
          >
            <option value="">-- Selecciona Destino --</option>
            {catalogos.destinos.map(d => (
              <option key={d.id} value={d.id}>
                {d.ciudad} ({d.codigo_terminal})
              </option>
            ))}
          </select>
        </label>

        <label>
          Vehículo
          <select
            name="vehiculo"
            value={form.vehiculo}
            onChange={handleChange}
            required
          >
            <option value="">-- Selecciona Vehículo --</option>
            {catalogos.vehiculos.map(v => (
              <option key={v.id} value={v.id}>
                {v.matricula} ({v.capacidad_asientos} asientos)
              </option>
            ))}
          </select>
        </label>

        <label>
          Fecha y hora de salida
          <input
            type="datetime-local"
            name="fecha_hora_salida"
            value={form.fecha_hora_salida}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Fecha y hora de llegada
          <input
            type="datetime-local"
            name="fecha_hora_llegada"
            value={form.fecha_hora_llegada}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Precio base
          <input
            type="number"
            step="0.01"
            name="precio_base"
            value={form.precio_base}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Estado de viaje
          <select
            name="estado_viaje"
            value={form.estado_viaje}
            onChange={handleChange}
            required
          >
            <option value="">-- Selecciona Estado --</option>
            {catalogos.estados.map(ev => (
              <option key={ev.id} value={ev.id}>
                {ev.descripcion}
              </option>
            ))}
          </select>
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
          <button type="button" onClick={() => navigate('/viajes')}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
