import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useSesion } from '../context/SesionContext'

export default function LayoutAdmin() {
  const { cerrarSesion } = useSesion()
  const navegar = useNavigate()

  function manejarCerrarSesion() {
    cerrarSesion()
    navegar('/admin/login')
  }

  return (
    <div className="admin">
      <aside className="admin-lateral">
        <div className="admin-titulo">
          <span className="logo-circulo">L</span>
          <span className="logo-texto">LEVAIN</span>
          <small>Administración</small>
        </div>

        <nav className="admin-menu">
          <NavLink to="/admin/productos">Productos</NavLink>
          <NavLink to="/admin/pedidos">Pedidos</NavLink>
        </nav>

        <div className="admin-menu admin-abajo">
          <Link to="/">Ver tienda</Link>
          <button onClick={manejarCerrarSesion}>Cerrar sesión</button>
        </div>
      </aside>

      <main className="admin-contenido">
        <Outlet />
      </main>
    </div>
  )
}
