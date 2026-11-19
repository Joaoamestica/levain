import { Navigate, Outlet } from 'react-router-dom'
import { useSesion } from '../context/SesionContext'

// Si hay sesión muestra las rutas hijas (Outlet); si no, manda al login
export default function RutaProtegida() {
  const { token } = useSesion()
  return token ? <Outlet /> : <Navigate to="/admin/login" replace />
}
