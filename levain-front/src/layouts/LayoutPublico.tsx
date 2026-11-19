import { Link, NavLink, Outlet } from 'react-router-dom'
import { useCarrito } from '../context/CarritoContext'

export default function LayoutPublico() {
  const { totalProductos } = useCarrito()

  return (
    <div className="pagina">
      <header className="encabezado">
        <Link to="/" className="logo">
          <span className="logo-circulo">L</span>
          <span className="logo-texto">LEVAIN</span>
        </Link>

        <nav className="navegacion">
          <NavLink to="/" end>
            Inicio
          </NavLink>
          <NavLink to="/productos">Productos</NavLink>
        </nav>

        <Link to="/carrito" className="boton-carrito" title="Carrito">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M3 6h2l2.4 12.2a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.6L21 8H6" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="9.5" cy="21.5" r="1.2" fill="currentColor" stroke="none" />
            <circle cx="17" cy="21.5" r="1.2" fill="currentColor" stroke="none" />
          </svg>
          {totalProductos > 0 && <span className="contador-carrito">{totalProductos}</span>}
        </Link>
      </header>

      {/* Aquí se dibuja la página que corresponda a la ruta */}
      <main className="contenido">
        <Outlet />
      </main>

      <footer className="pie">
        <span className="logo-texto">LEVAIN</span>
        <span>© 2026 Levain — Café &amp; Panadería</span>
        <Link to="/admin/login" className="pie-admin">
          Administración
        </Link>
      </footer>
    </div>
  )
}
