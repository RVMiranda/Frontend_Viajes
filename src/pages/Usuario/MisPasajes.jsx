// src/pages/Usuario/MisPasajes.jsx
import { useEffect, useState } from 'react'
import client from '../../api/axiosClient'
import '../../styles/DashboardUsuario.css'

export default function MisPasajes() {
  const [pasajes, setPasajes] = useState([])
  const [viajes, setViajes] = useState({})
  const [pasajeros, setPasajeros] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const user = JSON.parse(localStorage.getItem('user'))
        const allPasajes = JSON.parse(localStorage.getItem('pasajesComprados') || '[]')
        const myPasajes = allPasajes.filter(p => p.usuarioId === user?.id)

        setPasajes(myPasajes)

        // Cargamos detalles de cada viaje y pasajero
        const viajePromises = myPasajes.map(p =>
          client.get(`viajes/${p.viajeId}/`).then(res => ({ id: p.viajeId, data: res.data }))
        )
        const pasajeroPromises = myPasajes.map(p =>
          client.get(`pasajeros/${p.pasajeroId}/`).then(res => ({ id: p.pasajeroId, data: res.data }))
        )

        const viajeResults = await Promise.all(viajePromises)
        const pasajeroResults = await Promise.all(pasajeroPromises)

        const viajesMap = {}
        viajeResults.forEach(v => {
          viajesMap[v.id] = v.data
        })

        const pasajerosMap = {}
        pasajeroResults.forEach(p => {
          pasajerosMap[p.id] = p.data
        })

        setViajes(viajesMap)
        setPasajeros(pasajerosMap)
      } catch (err) {
        console.error(err)
        setError('Error cargando pasajes')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  if (loading) return <p className="du-mensaje">Cargando pasajes…</p>
  if (error) return <p className="du-mensaje error">{error}</p>

  return (
    <div className="du-container">
      <h1>Mis Pasajes</h1>

      {pasajes.length === 0 ? (
        <p>No has comprado pasajes aún.</p>
      ) : (
        <div className="du-list">
          {pasajes.map(p => {
            const viaje = viajes[p.viajeId]
            const pasajero = pasajeros[p.pasajeroId]

            return (
              <div key={p.id} className="du-card">
                <h3>Pasaje #{p.id}</h3>
                <strong>Fecha de compra:</strong> {new Date(p.fechaCompra).toLocaleString()}<br />

                {viaje ? (
                  <>
                    <strong>Viaje:</strong> {viaje.origen.ciudad} → {viaje.destino.ciudad}<br />
                    <strong>Salida:</strong> {new Date(viaje.fecha_hora_salida).toLocaleString()}<br />
                    <strong>Llegada:</strong> {new Date(viaje.fecha_hora_llegada).toLocaleString()}<br />
                    <strong>Precio:</strong> ${Number(viaje.precio_base).toFixed(2)}<br />
                  </>
                ) : (
                  <p>Cargando viaje...</p>
                )}

                {pasajero ? (
                  <>
                    <strong>Pasajero:</strong> {pasajero.nombre_completo}<br />
                    <strong>Documento:</strong> {pasajero.documento_identidad}<br />
                    <strong>Correo:</strong> {pasajero.correo_electronico}<br />
                    <strong>Teléfono:</strong> {pasajero.telefono}<br />
                  </>
                ) : (
                  <p>Cargando pasajero...</p>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
