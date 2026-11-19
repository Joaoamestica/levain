import { Link } from 'react-router-dom'
import { useCarrito } from '../context/CarritoContext'
import { formatearPrecio } from '../utils/formato'

export default function Carrito() {
  const { items, total, cambiarCantidad, quitar } = useCarrito()

  if (items.length === 0) {
    return (
      <section className="seccion centrado">
        <h1 className="titulo-pagina">Tu carrito</h1>
        <p className="estado">Tu carrito está vacío.</p>
        <Link to="/productos" className="boton boton-ancho-auto">
          Ver productos →
        </Link>
      </section>
    )
  }

  return (
    <section className="seccion">
      <h1 className="titulo-pagina">Tu carrito</h1>

      <div className="carrito">
        <ul className="carrito-lista">
          {items.map((item) => (
            <li key={item.productoId} className="carrito-item">
              <img src={item.imagenUrl} alt={item.nombre} />
              <div className="carrito-datos">
                <strong>{item.nombre}</strong>
                <span>{formatearPrecio(item.precio)} c/u</span>
              </div>
              <div className="selector-cantidad">
                <button onClick={() => cambiarCantidad(item.productoId, item.cantidad - 1)} disabled={item.cantidad <= 1}>
                  −
                </button>
                <span>{item.cantidad}</span>
                <button onClick={() => cambiarCantidad(item.productoId, item.cantidad + 1)} disabled={item.cantidad >= item.stock}>
                  +
                </button>
              </div>
              <strong className="carrito-subtotal">{formatearPrecio(item.precio * item.cantidad)}</strong>
              <button className="boton-texto" onClick={() => quitar(item.productoId)}>
                Quitar
              </button>
            </li>
          ))}
        </ul>

        <aside className="resumen">
          <h2>Resumen</h2>
          <div className="resumen-fila resumen-total">
            <span>Total</span>
            <strong>{formatearPrecio(total)}</strong>
          </div>
          <Link to="/checkout" className="boton">
            Ir al checkout →
          </Link>
        </aside>
      </div>
    </section>
  )
}
