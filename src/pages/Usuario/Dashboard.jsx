import { useEffect, useState } from 'react'
import client from '../../api/axiosClient'
import '../../styles/DashboardUsuario.css'

export default function DashboardUsuario() {
  const [trips, setTrips]         = useState([])
  const [filters, setFilters]     = useState({ destinos: [], tipos: [] })
  const [selectedDestino, setSelectedDestino] = useState('')
  const [selectedTipo, setSelectedTipo]       = useState('')
  const [mensaje, setMensaje]     = useState('')
  // estados por viaje:
  const [asientos, setAsientos]   = useState({})
  const [metodos, setMetodos]     = useState({})

  useEffect(() => {
    async function load() {
      try {
        const [viajesRes, destRes, tipoRes] = await Promise.all([
          client.get('viajes/?estado_viaje=1'),
          client.get('destinos/'),
          client.get('tipos-transporte/'),
        ])
        setTrips(viajesRes.data)
        setFilters({
          destinos: destRes.data,
          tipos:    tipoRes.data,
        })
      } catch (err) {
        console.error(err)
      }
    }
    load()
  }, [])

  // mapea cada viaje con sus objetos relacionados para mostrar nombres
  const displayTrips = trips
    .map(v => ({
      ...v,
      origenObj:   filters.destinos.find(d => d.id === v.origen),
      destinoObj:  filters.destinos.find(d => d.id === v.destino),
      tipoObj:     filters.tipos.find(t => t.id === v.vehiculo),
    }))
    .filter(v => {
      return (
        (!selectedDestino || v.destino === +selectedDestino) &&
        (!selectedTipo    || v.vehiculo === +selectedTipo)
      )
    })

  const handleAsientoChange = (id, value) => {
    setAsientos(prev => ({ ...prev, [id]: value }))
  }

  const handleMetodoChange = (id, value) => {
    setMetodos(prev => ({ ...prev, [id]: value }))
  }

  const handleBuy = async (viajeId) => {
    setMensaje('')
    const asiento     = asientos[viajeId]
    const metodoPago  = metodos[viajeId]
    if (!asiento || !metodoPago) {
      setMensaje('Selecciona asiento y método de pago.')
      return
    }
    try {
      await client.post('pasajes/', {
        viaje: viajeId,
        numero_asiento: asiento,
        metodo_pago: metodoPago,
        estatus_pasaje: 1
      })
      setMensaje('¡Pasaje comprado correctamente!')
      // opcional: refrescar o navegar
    } catch {
      setMensaje('Error al comprar pasaje.')
    }
  }

  return (
    <div className="du-container">
      <h1>Viajes Disponibles</h1>

      <div className="du-filtros">
        <select
          value={selectedDestino}
          onChange={e => setSelectedDestino(e.target.value)}
        >
          <option value="">Todos los destinos</option>
          {filters.destinos.map(d => (
            <option key={d.id} value={d.id}>
              {d.nombre}
            </option>
          ))}
        </select>

        <select
          value={selectedTipo}
          onChange={e => setSelectedTipo(e.target.value)}
        >
          <option value="">Todos los transportes</option>
          {filters.tipos.map(t => (
            <option key={t.id} value={t.id}>
              {t.tipo_transporte}
            </option>
          ))}
        </select>
      </div>

      {mensaje && <div className="du-mensaje">{mensaje}</div>}

      <div className="du-list">
        {displayTrips.map(v => (
          <div key={v.id} className="du-card">
            <div>
              <strong>Origen:</strong>{' '}
              {v.origenObj?.nombre || v.origen}<br/>
              <strong>Destino:</strong>{' '}
              {v.destinoObj?.nombre || v.destino}<br/>
              <strong>Transporte:</strong>{' '}
              {v.tipoObj?.tipo_transporte || v.vehiculo}<br/>
              <strong>Salida:</strong>{' '}
              {new Date(v.fecha_hora_salida).toLocaleString()}<br/>
              <strong>Llegada:</strong>{' '}
              {new Date(v.fecha_hora_llegada).toLocaleString()}<br/>
              <strong>Precio:</strong> ${Number(v.precio_base).toFixed(2)}

            </div>

            <div className="du-actions">
              <input
                type="number"
                min="1"
                placeholder="Asiento #"
                value={asientos[v.id] || ''}
                onChange={e => handleAsientoChange(v.id, e.target.value)}
              />
              <select
                value={metodos[v.id] || ''}
                onChange={e => handleMetodoChange(v.id, e.target.value)}
              >
                <option value="">Método pago</option>
                {/* podrías cargar esto desde un endpoint /metodo-pago/ */}
                <option value="1">Tarjeta</option>
                <option value="2">Efectivo</option>
              </select>
              <button onClick={() => handleBuy(v.id)}>Comprar</button>
            </div>
          </div>
        ))}

        {displayTrips.length === 0 && (
          <p>No hay viajes con esos filtros.</p>
        )}
      </div>
    </div>
  )
}