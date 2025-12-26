import { useEffect, useState } from 'react'
import client from '../../api/axiosClient'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts'
import '../../styles/Dashboard.css'

export default function Dashboard() {
  const [stats, setStats] = useState({
    total_usuarios: 0,
    total_viajes: 0,
    viajes_por_mes: []
  })

  useEffect(() => {
    async function fetchStats() {
      try {
        const { data } = await client.get('stats/')
        setStats(data)
      } catch (err) {
        console.error('Error cargando stats:', err)
      }
    }
    fetchStats()
  }, [])

  // Preparamos los datos del chart: 
  // [{ month: "2025-07", count: 1 }, ...]
  const chartData = stats.viajes_por_mes.map(item => ({
    quarter: item.month,  // o renombra a month en el eje X
    count: item.count
  }))

  return (
    <div className="dashboard-container">
      <div className="cards">
        <div className="card">
          <div className="card-label">Usuarios</div>
          <div className="card-value">
            {stats.total_usuarios.toLocaleString()}
          </div>
        </div>
        <div className="card">
          <div className="card-label">Viajes</div>
          <div className="card-value">
            {stats.total_viajes.toLocaleString()}
          </div>
        </div>
      </div>

      <div className="chart-wrapper">
        <h3>Viajes por Mes</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="quarter" 
                   tickFormatter={t => t.slice(5)} /* muestra sólo "07", "10", etc. */
            />
            <YAxis />
            <Tooltip formatter={(value) => [value, 'Viajes']} />
            <Bar dataKey="count" name="Viajes" fill="#3182ce" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}