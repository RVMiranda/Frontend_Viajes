// src/components/UsuarioForm.jsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate, useOutletContext } from 'react-router-dom'
import client from '../api/axiosClient'
import '../styles/Usuarios.css'

export default function UsuarioForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { refresh } = useOutletContext()

  const [form, setForm] = useState({
    nombre_usuario: '',
    contrasena:     '',
    rol:            '',
    estado:         true
  })

  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    async function loadData() {
      try {
        // Cargamos los roles primero
        const { data: rolesData } = await client.get('/roles')
        setRoles(rolesData)

        // Si estamos editando usuario
        if (id) {
          const { data: usuarioData } = await client.get(`/usuarios/${id}/`)
          setForm({
            nombre_usuario: usuarioData.nombre_usuario,
            contrasena:     '',
            rol:            usuarioData.rol.id,
            estado:         usuarioData.estado
          })
        }
      } catch (err) {
        console.error(err)
        setError('No se pudo cargar datos')
      } finally {
        setLoading(false)
      }
    }

    loadData()
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
        nombre_usuario: form.nombre_usuario,
        ...(form.contrasena && { contrasena: form.contrasena }),
        rol_id: form.rol,
        estado: form.estado
      }

      if (id) {
        await client.patch(`/usuarios/${id}/`, payload)
      } else {
        await client.post('/usuarios/', payload)
      }

      refresh()
      navigate('/usuarios')
    } catch (err) {
      console.error(err)
      setError('Error guardando usuario')
    }
  }

  if (loading) return <p>Cargando usuario…</p>

  return (
    <div className="form-page">
      <h2>{id ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit} className="usuario-form">
        <label>
          Nombre de usuario
          <input
            name="nombre_usuario"
            value={form.nombre_usuario}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Contraseña
          <input
            name="contrasena"
            type="password"
            placeholder={id ? 'Déjalo en blanco si no cambias' : ''}
            value={form.contrasena}
            onChange={handleChange}
            {...(id ? {} : { required: true })}
          />
        </label>

        <label>
          Rol
          <select
            name="rol"
            value={form.rol}
            onChange={handleChange}
            required
          >
            <option value="">--Selecciona rol--</option>
            {roles.map(r => (
              <option key={r.id} value={r.id}>{r.nombre}</option>
            ))}
          </select>
        </label>

        <label className="checkbox-label">
          <input
            name="estado"
            type="checkbox"
            checked={form.estado}
            onChange={handleChange}
          />
          Activo
        </label>

        <div className="form-actions">
          <button type="submit">{id ? 'Guardar' : 'Crear'}</button>
          <button type="button" onClick={() => navigate('/usuarios')}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
