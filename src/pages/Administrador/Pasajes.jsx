// src/pages/Administrador/Pasajes.jsx
import { useEffect, useState } from 'react'
import { useNavigate, Outlet } from 'react-router-dom'
import client from '../../api/axiosClient'
import '../../styles/Pasajes.css'

export default function Pasajes() {
  const [pasajes, setPasajes]       = useState([])
  const [viajes, setViajes]         = useState([])
  const [pasajeros, setPasajeros]   = useState([])
  const [estatus, setEstatus]       = useState([])
  const [metodosPago, setMetodosPago] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      setLoading(true)
      const [pasajesData, viajesData, pasajerosData, estatusData, metodosData] = await Promise.all([
        client.get('/pasajes/'),
        client.get('/viajes/'),
        client.get('/pasajeros/'),
        client.get('/estatus-pasaje/'),
        client.get('/metodos-pago/')
      ])

      setPasajes(pasajesData.data)
      setViajes(viajesData.data)
      setPasajeros(pasajerosData.data)
      setEstatus(estatusData.data)
      setMetodosPago(metodosData.data)

    } catch (err) {
      console.error(err)
      setError('Error cargando pasajes.')
    } finally {
      setLoading(false)
    }
  }

  async function toggleEstado(p) {
    try {
      await client.patch(`/pasajes/${p.id}/`, { estado: !p.estado })
      fetchData()
    } catch {
      setError('No se pudo actualizar estado.')
    }
  }

  // Funciones helpers
  function getViajeNombre(viajeId) {
    const viaje = viajes.find(v => v.id === viajeId)
    if (!viaje) return ''
    return `${viaje.origen.ciudad} - ${viaje.destino.ciudad}`
  }

  function getPasajeroNombre(pasajeroId) {
    const pasajero = pasajeros.find(p => p.id === pasajeroId)
    return pasajero ? pasajero.nombre_completo : ''
  }

  function getEstatusDescripcion(id) {
    const est = estatus.find(e => e.id === id)
    return est ? est.descripcion : ''
  }

  function getMetodoPagoNombre(id) {
    const metodo = metodosPago.find(m => m.id === id)
    return metodo ? metodo.descripcion : ''
  }


  if (loading) return <p className="du-mensaje">Cargando pasajes…</p>
  if (error)   return <p className="du-mensaje error">{error}</p>

  return (
    <div className="pasajes-page">
      <div className="pasajes-header">
        <h1>Gestión de Pasajes</h1>
        <button className="btn-new" onClick={() => navigate('form')}>
          + Nuevo Pasaje
        </button>
      </div>

      <table className="pasajes-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Viaje</th>
            <th>Pasajero</th>
            <th>Asiento</th>
            <th>Precio</th>
            <th>Estatus</th>
            <th>Pago</th>
            <th>Fecha Compra</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pasajes.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{getViajeNombre(p.viaje)}</td>
              <td>{getPasajeroNombre(p.pasajero)}</td>
              <td>{p.numero_asiento}</td>
              <td>${parseFloat(p.precio_pagado).toLocaleString('es-MX')}</td>
              <td>{getEstatusDescripcion(p.estatus_pasaje)}</td>
              <td>{getMetodoPagoNombre(p.metodo_pago)}</td>
              <td>{new Date(p.fecha_compra).toLocaleString('es-MX')}</td>
              <td>{p.estado ? 'Activo' : 'Inactivo'}</td>
              <td>
                <button onClick={() => navigate(`form/${p.id}`)}>Editar</button>
                <button onClick={() => toggleEstado(p)}>
                  {p.estado ? 'Desactivar' : 'Activar'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Outlet context={{ refresh: fetchData }} />
    </div>
  )
}
