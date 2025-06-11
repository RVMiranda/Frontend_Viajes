import { useState } from 'react'
import client from '../../api/axiosClient'
import { useNavigate } from 'react-router-dom'
import '../../styles/Restablecer.css'

export default function ResetPassword() {
  const [step, setStep] = useState(1)
  const [username, setUsername] = useState('')
  const [userId, setUserId] = useState(null)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  // Paso 1: lookup por nombre de usuario
  const handleFindUser = async e => {
    e.preventDefault()
    setError('')
    try {
      const res = await client.get(
        `usuarios/lookup/?nombre_usuario=${encodeURIComponent(username)}`
      )
      // esperamos { id: X, ... }
      setUserId(res.data.id)
      setStep(2)
    } catch (err) {
      console.error(err)
      setError(
        err.response?.data?.detail ||
        'No se encontró usuario con ese nombre.'
      )
    }
  }

  // Paso 2: patch de nueva contraseña
  const handleReset = async e => {
    e.preventDefault()
    setError('')
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }
    if (password !== confirm) {
      setError('Las contraseñas no coinciden.')
      return
    }

    try {
      await client.patch(`usuarios/${userId}/`, { contrasena: password })
      setSuccess('Contraseña actualizada. Redirigiendo a login…')
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      console.error(err)
      setError('Error al actualizar la contraseña.')
    }
  }

  return (
    <div className="rp-wrapper">
      {step === 1 && (
        <form className="rp-form" onSubmit={handleFindUser}>
          <h2>Restablecer Contraseña</h2>
          {error && <div className="rp-error">{error}</div>}

          <label htmlFor="user">Nombre de usuario</label>
          <input
            id="user"
            type="text"
            value={username}
            onChange={e => {
              setUsername(e.target.value)
              setError('')
            }}
            placeholder="Tu nombre de usuario"
            required
          />

          <button type="submit" className="rp-btn">
            Siguiente
          </button>
        </form>
      )}

      {step === 2 && (
        <form className="rp-form" onSubmit={handleReset}>
          <h2>Ingresa la nueva contraseña</h2>
          {error && <div className="rp-error">{error}</div>}
          {success && <div className="rp-success">{success}</div>}

          <label htmlFor="new">Nueva Contraseña</label>
          <input
            id="new"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Mínimo 6 caracteres"
            required
          />

          <label htmlFor="confirm">Confirmar Contraseña</label>
          <input
            id="confirm"
            type="password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            placeholder="Repite la contraseña"
            required
          />

          <button type="submit" className="rp-btn">
            Restablecer
          </button>
        </form>
      )}
    </div>
  )
}