import { useEffect, useState } from 'react'
import client from '../../api/axiosClient'
import '../../styles/DashboardUsuario.css'
import '../../styles/MisPasajes.css'

export default function MisPasajes() {
  const [pasajes, setPasajes] = useState([])
  const [viajes, setViajes]   = useState([])
  const [metodos, setMetodos] = useState([])
  const [estatuses, setEstatuses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [pasajesRes, viajesRes, metodosRes, estatusesRes] = await Promise.all([
          client.get('pasajes/'),
          client.get('viajes/'),
          client.get('metodos-pago/'),
          client.get('estatus-pasaje/') // 👈 endpoint para traer estatus de pasaje
        ])
        setPasajes(pasajesRes.data)
        setViajes(viajesRes.data)
        setMetodos(metodosRes.data)
        setEstatuses(estatusesRes.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // helper para mostrar viaje con Origen - Destino
  const getViajeInfo = (viajeId) => {
    const v = viajes.find(v => v.id === viajeId)
    if (!v) return viajeId
    return `${v.origen.ciudad} → ${v.destino.ciudad} (${new Date(v.fecha_hora_salida).toLocaleDateString()})`
  }

  const getMetodoPago = (metodoId) => {
    const m = metodos.find(m => m.id === metodoId)
    return m ? m.descripcion : metodoId
  }

  const getEstatusPasaje = (estatusId) => {
    const e = estatuses.find(e => e.id === estatusId)
    return e ? e.descripcion : estatusId
  }

  if (loading) return <p>Cargando tus pasajes...</p>

  return (
    <div className="du-container">
      <h1>Mis Pasajes</h1>

      {pasajes.length === 0 && <p>No has comprado pasajes todavía.</p>}

      <div className="du-list">
        {pasajes.map(p => (
          <div key={p.id} className="du-card">
            <div>
              <strong>Viaje:</strong> {getViajeInfo(p.viaje)}<br/>
              <strong>Asiento:</strong> {p.numero_asiento}<br/>
              <strong>Precio pagado:</strong> ${Number(p.precio_pagado).toFixed(2)}<br/>
              <strong>Método de pago:</strong> {getMetodoPago(p.metodo_pago)}<br/>
              <strong>Estatus:</strong> {getEstatusPasaje(p.estatus_pasaje)}<br/>
              <strong>Fecha de compra:</strong> {new Date(p.fecha_compra).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
