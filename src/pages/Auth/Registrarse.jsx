import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import client from '../../api/axiosClient'
import '../../styles/Registrarse.css'

export default function Register() {
    const [usuario, setUsuario] = useState('')
    const [contrasena, setContrasena] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async e => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            await client.post('usuarios/', {
                nombre_usuario: usuario,
                contrasena,
                rol_id: 3,
                estado: true
            })
            navigate('/login')
            } catch (err) {
                console.error('Error al registrar:', err.response.status, err.response.data)
                setError(
                    typeof err.response.data === 'object'
                    ? JSON.stringify(err.response.data)
                    : err.response.data
                )
                setLoading(false)
            }
    }

    return (
        <div className="register-wrapper">
        <form className="register-form" onSubmit={handleSubmit}>
            <h2>Registrarse</h2>

            {error && <div className="register-error">{error}</div>}

            <label htmlFor="usuario">Usuario</label>
            <input
                id="usuario"
                type="text"
                value={usuario}
                onChange={e => setUsuario(e.target.value)}
                placeholder="Nombre de usuario"
                required
            />

            <label htmlFor="pass">Contraseña</label>
            <input
                id="pass"
                type="password"
                value={contrasena}
                onChange={e => setContrasena(e.target.value)}
                placeholder="Contraseña"
                required
            />

            <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? 'Registrando...' : 'Crear cuenta'}
            </button>
        </form>
        </div>
    )
}