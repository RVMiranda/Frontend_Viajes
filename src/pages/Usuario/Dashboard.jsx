import { useEffect, useState } from 'react'
import client from '../../api/axiosClient'
import '../../styles/DashboardUsuario.css'

export default function DashboardUsuario() {
  const [trips, setTrips] = useState([])
  const [filters, setFilters] = useState({ destinos: [], tipos: [] })
  const [selectedDestino, setSelectedDestino] = useState('')
  const [selectedTipo, setSelectedTipo] = useState('')
  const [asiento, setAsiento] = useState('')
  const [metodoPago, setMetodoPago] = useState('')
  const [mensaje, setMensaje] = useState('')

  // Carga inicial: viajes y filtros
  useEffect(() => {
    async function load() {
      try {
        const [{ data: viajes }, { data: destinos }, { data: tipos }] =
          await Promise.all([
            client.get('viajes/?estado_viaje=1'),
            client.get('destinos/'),
            client.get('tipos-transporte/'),
          ])
        setTrips(viajes)
        setFilters({ destinos, tipos })
      } catch (err) {
        console.error(err)
      }
    }
    load()
  }, [])

  // Comprueba si un viaje cumple los filtros activos
  const filteredTrips = trips.filter(v => {
    return (
      (!selectedDestino || v.destino === +selectedDestino) &&
      (!selectedTipo || v.vehiculo === +selectedTipo)
    )
  })

  // Maneja la compra de un pasaje
  const handleBuy = async (viajeId) => {
    setMensaje('')
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
      // opcional: refrescar viajes o redirigir
    } catch (err) {
      console.error(err)
      setMensaje('Error al comprar pasaje.')
    }
  }

  return (
    <div className="du-container">
      <h1>Viajes Disponibles</h1>

      {/* Filtros */}
      <div className="du-filtros">
        <select
          value={selectedDestino}
          onChange={e => setSelectedDestino(e.target.value)}
        >
          <option value="">Todos los destinos</option>
          {filters.destinos.map(d => (
            <option key={d.id} value={d.id}>{d.nombre}</option>
          ))}
        </select>

        <select
          value={selectedTipo}
          onChange={e => setSelectedTipo(e.target.value)}
        >
          <option value="">Todos los transportes</option>
          {filters.tipos.map(t => (
            <option key={t.id} value={t.id}>{t.tipo}</option>
          ))}
        </select>
      </div>

      {mensaje && <div className="du-mensaje">{mensaje}</div>}

      {/* Listado de viajes */}
      <div className="du-list">
        {filteredTrips.length === 0 ? (
          <p>No hay viajes disponibles.</p>
        ) : (
          filteredTrips.map(v => (
            <div key={v.id} className="du-card">
              <div>
                <strong>Origen:</strong> {v.origen} <br/>
                <strong>Destino:</strong> {v.destino} <br/>
                <strong>Salida:</strong> {new Date(v.fecha_hora_salida).toLocaleString()}<br/>
                <strong>Llegada:</strong> {new Date(v.fecha_hora_llegada).toLocaleString()}<br/>
                <strong>Precio:</strong> ${v.precio_base}
              </div>

              <div className="du-actions">
                <input
                  type="number"
                  placeholder="Asiento #"
                  value={asiento}
                  onChange={e => setAsiento(e.target.value)}
                  min="1"
                />
                <select
                  value={metodoPago}
                  onChange={e => setMetodoPago(e.target.value)}
                >
                  <option value="">Método pago</option>
                  <option value="1">Tarjeta</option>
                  <option value="2">Efectivo</option>
                  {/* añade más según tu API */}
                </select>
                <button onClick={() => handleBuy(v.id)}>
                  Comprar
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
