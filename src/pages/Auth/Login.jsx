import { useState } from 'react'
import axios from 'axios'
import '../../styles/Login.css'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [usuario, setUsuario] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')

    try {
      const res = await axios.post('http://localhost:8001/api/login/', {
        nombre_usuario: usuario,
        contrasena
      })

      // --- Aquí recogemos el token ---
      const { token } = res.data    // o el campo que use tu API, ej: access, jwt, etc.
      // 1) Lo guardamos en localStorage
      localStorage.setItem('token', token)

      // 2) Lo ponemos por defecto en los headers de axios para futuras peticiones
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

      // 3) (Opcional) si tienes un contexto de usuario podrías notificar el login aquí

      // 4) Redirigimos al dashboard u otra ruta protegida
      navigate('/dashboard')
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.detail || 'Usuario o contraseña incorrectos')
    }
  }

  return (
    <div className="login-wrapper">
      {/* Panel izquierdo */}
      <div className="login-panel signup-panel">
        <h2>¿No tienes cuenta?</h2>
        <p>Regístrate para empezar a viajar</p>
        <button onClick={() => navigate('/registrarse')}>
          Sign Up
        </button>
      </div>

      {/* Panel derecho: formulario */}
      <div className="login-panel form-panel">
        <form onSubmit={handleSubmit}>
          <h2>Log In</h2>
          {error && <div className="error">{error}</div>}

          <label htmlFor="user">Usuario</label>
          <input
            id="user"
            type="text"
            value={usuario}
            onChange={e => setUsuario(e.target.value)}
            required
          />

          <label htmlFor="pass">Contraseña</label>
          <input
            id="pass"
            type="password"
            value={contrasena}
            onChange={e => setContrasena(e.target.value)}
            required
          />

          <div className="aux-links">
            <a href="/forgot">¿Olvidaste tu contraseña?</a>
          </div>

          <button type="submit" className="btn-submit">
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  )
}