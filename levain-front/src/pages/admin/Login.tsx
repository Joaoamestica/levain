import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import Campo from '../../components/Campo'
import MensajeError from '../../components/MensajeError'
import { useSesion } from '../../context/SesionContext'
import { ingresar, mensajeDeError } from '../../api/cliente'
import { esquemaLogin } from '../../schemas/login'
import { validar } from '../../utils/validar'
import type { Errores } from '../../utils/validar'

export default function Login() {
  const { token, iniciarSesion } = useSesion()
  const navegar = useNavigate()

  const [valores, setValores] = useState({ correo: '', clave: '' })
  const [errores, setErrores] = useState<Errores>({})
  const [errorServidor, setErrorServidor] = useState('')
  const [enviando, setEnviando] = useState(false)

  // Si ya hay sesión, no tiene sentido ver el login
  if (token) return <Navigate to="/admin/productos" replace />

  function manejarCambio(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setValores({ ...valores, [name]: value })
    setErrores({ ...errores, [name]: '' })
  }

  async function manejarEnvio(e: FormEvent) {
    e.preventDefault()
    setErrorServidor('')

    const resultado = validar(esquemaLogin, valores)
    if (resultado.errores) {
      setErrores(resultado.errores)
      return
    }

    setEnviando(true)
    try {
      const respuesta = await ingresar(resultado.datos.correo, resultado.datos.clave)
      iniciarSesion(respuesta.token)
      navegar('/admin/productos')
    } catch (error) {
      setErrorServidor(mensajeDeError(error))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="login">
      <form className="formulario login-tarjeta" onSubmit={manejarEnvio} noValidate>
        <div className="login-logo">
          <span className="logo-circulo">L</span>
          <span className="logo-texto">LEVAIN</span>
        </div>
        <h1>Administración</h1>

        <Campo etiqueta="Correo" error={errores.correo}>
          <input name="correo" type="email" value={valores.correo} onChange={manejarCambio} placeholder="admin@levain.cl" />
        </Campo>
        <Campo etiqueta="Clave" error={errores.clave}>
          <input name="clave" type="password" value={valores.clave} onChange={manejarCambio} />
        </Campo>

        {errorServidor && <MensajeError mensaje={errorServidor} />}

        <button className="boton" type="submit" disabled={enviando}>
          {enviando ? 'Ingresando...' : 'Ingresar'}
        </button>
        <Link to="/" className="enlace-volver">
          ← Volver a la tienda
        </Link>
      </form>
    </div>
  )
}
