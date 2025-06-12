import { useEffect, useState } from 'react'
import client from '../../api/axiosClient'
import '../../styles/DashboardUsuario.css'

export default function DashboardUsuario() {
  const [trips, setTrips]         = useState([])
  const [filters, setFilters]     = useState({ destinos: [], tipos: [] })
  const [selectedDestino, setSelectedDestino] = useState('')
  const [selectedTipo, setSelectedTipo]       = useState('')
  const [mensaje, setMensaje]     = useState('')
  const [metodosPago, setMetodosPago] = useState([])
  const [loadingCompra, setLoadingCompra] = useState({})
  const [showCompra, setShowCompra] = useState({})
  const [asientos, setAsientos] = useState({})
  const [metodos, setMetodos]   = useState({})
  const [pasajeros, setPasajeros] = useState({}) // pasajero form por viajeId

  useEffect(() => {
    async function load() {
      try {
        const [viajesRes, destRes, tipoRes, metodosRes] = await Promise.all([
          client.get('viajes/'),
          client.get('destinos/'),
          client.get('tipos-transporte/'),
          client.get('metodos-pago/')
        ])
        setTrips(viajesRes.data)
        setFilters({
          destinos: destRes.data,
          tipos:    tipoRes.data
        })
        setMetodosPago(metodosRes.data)
      } catch (err) {
        console.error(err)
      }
    }
    load()
  }, [])

  const displayTrips = trips
    .map(v => ({
      ...v,
      tipoObj: filters.tipos.find(t => t.id === v.vehiculo.id)
    }))
    .filter(v => {
      return (
        (!selectedDestino || v.destino.id === +selectedDestino) &&
        (!selectedTipo    || v.vehiculo.id === +selectedTipo)
      )
    })

  const handleAsientoChange = (id, value) => {
    setAsientos(prev => ({ ...prev, [id]: value }))
  }

  const handleMetodoChange = (id, value) => {
    setMetodos(prev => ({ ...prev, [id]: value }))
  }

  const handlePasajeroChange = (viajeId, field, value) => {
    setPasajeros(prev => ({
      ...prev,
      [viajeId]: {
        ...prev[viajeId],
        [field]: value
      }
    }))
  }

  const handleShowCompra = (viajeId) => {
    setShowCompra(prev => ({ ...prev, [viajeId]: true }))
    setMensaje('')
  }

  const handleHideCompra = (viajeId) => {
    setShowCompra(prev => ({ ...prev, [viajeId]: false }))
    setMensaje('')
  }

  const handleBuy = async (viajeId, v) => {
    setMensaje('')
    const asiento     = asientos[viajeId]
    const metodoPago  = metodos[viajeId]
    const pasajeroData = pasajeros[viajeId]

    if (!pasajeroData?.nombre_completo || !pasajeroData?.documento_identidad || !pasajeroData?.correo_electronico || !pasajeroData?.telefono) {
      setMensaje('Completa los datos del pasajero.')
      return
    }

    if (!asiento?.trim() || !metodoPago) {
      setMensaje('Selecciona asiento y método de pago.')
      return
    }

    try {
      // ACTIVAR LOADING:
      setLoadingCompra(prev => ({ ...prev, [viajeId]: true }))

      // 1️⃣ Registrar pasajero
      const pasajeroRes = await client.post('pasajeros/', {
        nombre_completo:      pasajeroData.nombre_completo,
        documento_identidad:  pasajeroData.documento_identidad,
        correo_electronico:   pasajeroData.correo_electronico,
        telefono:             pasajeroData.telefono,
        estado: true
      })
      const pasajeroId = pasajeroRes.data.id

      // 2️⃣ Registrar pasaje
      await client.post('pasajes/', {
        viaje: viajeId,
        pasajero: pasajeroId,
        numero_asiento: asiento,
        precio_pagado: v.precio_base,
        metodo_pago: metodoPago,
        estatus_pasaje: 1,
        fecha_compra: new Date().toISOString(),
        estado: true
      })

      setMensaje('¡Pasaje comprado correctamente!')

      // Reset form
      setAsientos(prev => ({ ...prev, [viajeId]: '' }))
      setMetodos(prev => ({ ...prev, [viajeId]: '' }))
      setPasajeros(prev => ({ ...prev, [viajeId]: {} }))
      setShowCompra(prev => ({ ...prev, [viajeId]: false }))
    } catch {
      setMensaje('Error al comprar pasaje.')
    } finally {
      // DESACTIVAR LOADING:
      setLoadingCompra(prev => ({ ...prev, [viajeId]: false }))
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
              {d.ciudad} ({d.codigo_terminal})
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
              {t.nombre}
            </option>
          ))}
        </select>
      </div>

      {mensaje && <div className="du-mensaje">{mensaje}</div>}

      <div className="du-list">
        {displayTrips.map(v => (
          <div key={v.id} className="du-card">
            <div>
              <strong>Origen:</strong> {v.origen.ciudad} ({v.origen.codigo_terminal})<br/>
              <strong>Destino:</strong> {v.destino.ciudad} ({v.destino.codigo_terminal})<br/>
              <strong>Transporte:</strong> {v.tipoObj?.nombre || v.vehiculo.id}<br/>
              <strong>Salida:</strong> {new Date(v.fecha_hora_salida).toLocaleString()}<br/>
              <strong>Llegada:</strong> {new Date(v.fecha_hora_llegada).toLocaleString()}<br/>
              <strong>Precio:</strong> ${Number(v.precio_base).toFixed(2)}
            </div>

            {!showCompra[v.id] ? (
              <button onClick={() => handleShowCompra(v.id)}>
                Comprar
              </button>
            ) : (
              <>
                <div style={{ marginTop: '1rem' }}>
                  <h4>Datos del pasajero</h4>
                  <input
                    type="text"
                    placeholder="Nombre completo"
                    value={pasajeros[v.id]?.nombre_completo || ''}
                    onChange={e => handlePasajeroChange(v.id, 'nombre_completo', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Documento identidad"
                    value={pasajeros[v.id]?.documento_identidad || ''}
                    onChange={e => handlePasajeroChange(v.id, 'documento_identidad', e.target.value)}
                  />
                  <input
                    type="email"
                    placeholder="Correo electrónico"
                    value={pasajeros[v.id]?.correo_electronico || ''}
                    onChange={e => handlePasajeroChange(v.id, 'correo_electronico', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Teléfono"
                    value={pasajeros[v.id]?.telefono || ''}
                    onChange={e => handlePasajeroChange(v.id, 'telefono', e.target.value)}
                  />
                </div>

                <div className="du-actions">
                  <input
                    type="text"
                    placeholder="Asiento #"
                    value={asientos[v.id] || ''}
                    onChange={e => handleAsientoChange(v.id, e.target.value)}
                  />
                  <select
                    value={metodos[v.id] || ''}
                    onChange={e => handleMetodoChange(v.id, e.target.value)}
                  >
                    <option value="">Método pago</option>
                    {metodosPago.map(m => (
                      <option key={m.id} value={m.id}>{m.descripcion}</option>
                    ))}
                  </select>
                  <button onClick={() => handleBuy(v.id, v)}>Confirmar compra</button>
                  <button onClick={() => handleHideCompra(v.id)}>Cancelar</button>
                </div>
              </>
            )}
          </div>
        ))}

        {displayTrips.length === 0 && (
          <p>No hay viajes con esos filtros.</p>
        )}
      </div>
    </div>
  )
}
