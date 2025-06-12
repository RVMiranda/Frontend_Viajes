// src/components/PasajeForm.jsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate, useOutletContext } from 'react-router-dom'
import client from '../api/axiosClient'
import '../styles/Pasajes.css'

export default function PasajeForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { refresh } = useOutletContext()

  const [form, setForm] = useState({
    viaje: '',
    pasajero: '',
    numero_asiento: '',
    precio_pagado: '',
    estatus_pasaje: '',
    metodo_pago: '',
    fecha_compra: '',
    estado: true
  })

  const [viajes, setViajes] = useState([])
  const [pasajeros, setPasajeros] = useState([])
  const [estatus, setEstatus] = useState([])
  const [metodosPago, setMetodosPago] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    loadCatalogos()
  }, [])

  async function loadCatalogos() {
    try {
      const [viajesData, pasajerosData, estatusData, metodosData] = await Promise.all([
        client.get('/viajes/'),
        client.get('/pasajeros/'),
        client.get('/estatus-pasaje/'),
        client.get('/metodos-pago/')
      ])
      setViajes(viajesData.data)
      setPasajeros(pasajerosData.data)
      setEstatus(estatusData.data)
      setMetodosPago(metodosData.data)

      if (id) {
        const { data } = await client.get(`/pasajes/${id}/`)
        setForm({
          viaje: data.viaje,
          pasajero: data.pasajero,
          numero_asiento: data.numero_asiento,
          precio_pagado: data.precio_pagado,
          estatus_pasaje: data.estatus_pasaje,
          metodo_pago: data.metodo_pago,
          fecha_compra: data.fecha_compra.slice(0,16),
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
        ...form,
        fecha_compra: new Date(form.fecha_compra).toISOString()
      }
      if (id) await client.patch(`/pasajes/${id}/`, payload)
      else    await client.post('/pasajes/', payload)
      refresh()
      navigate('/pasajes')
    } catch (err) {
      console.error(err)
      setError('Error guardando pasaje')
    }
  }

  if (loading) return <p className="du-mensaje">Cargando formulario…</p>
  if (error)   return <p className="du-mensaje error">{error}</p>

  return (
    <div className="form-page">
      <h2 className="form-title">{id ? 'Editar Pasaje' : 'Nuevo Pasaje'}</h2>
      <form onSubmit={handleSubmit} className="usuario-form">

        <label>
          Viaje
          <select name="viaje" value={form.viaje} onChange={handleChange} required>
            <option value="">Seleccione un viaje</option>
            {viajes.map(v => (
              <option key={v.id} value={v.id}>
                {`${v.origen.ciudad} - ${v.destino.ciudad} / Salida: ${new Date(v.fecha_hora_salida).toLocaleString('es-MX')} / Llegada: ${new Date(v.fecha_hora_llegada).toLocaleString('es-MX')}`}
              </option>
            ))}
          </select>
        </label>

        <label>
          Pasajero
          <select name="pasajero" value={form.pasajero} onChange={handleChange} required>
            <option value="">Seleccione un pasajero</option>
            {pasajeros.map(p => (
              <option key={p.id} value={p.id}>{p.nombre_completo}</option>
            ))}
          </select>
        </label>

        <label>
          Asiento
          <input
            name="numero_asiento"
            value={form.numero_asiento}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Precio Pagado
          <input
            type="number"
            step="0.01"
            name="precio_pagado"
            value={form.precio_pagado}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Estatus
          <select name="estatus_pasaje" value={form.estatus_pasaje} onChange={handleChange} required>
            <option value="">Seleccione un estatus</option>
            {estatus.map(e => (
              <option key={e.id} value={e.id}>{e.descripcion}</option>
            ))}
          </select>
        </label>

        <label>
            Método de Pago
            <select name="metodo_pago" value={form.metodo_pago} onChange={handleChange} required>
                <option value="">Seleccione un método de pago</option>
                {metodosPago.map(m => (
                <option key={m.id} value={m.id}>{m.descripcion}</option>
                ))}
            </select>
        </label>

        <label>
          Fecha Compra
          <input
            type="datetime-local"
            name="fecha_compra"
            value={form.fecha_compra}
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
          <button type="button" onClick={() => navigate('/pasajes')}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
