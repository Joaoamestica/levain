import { Link } from 'react-router-dom'
import { useCarrito } from '../context/CarritoContext'
import type { Producto } from '../tipos'
import { formatearPrecio } from '../utils/formato'

interface PropsTarjeta {
  producto: Producto
}

const NOMBRE_CATEGORIA = { cafe: 'Café', pan: 'Panadería' }

export default function TarjetaProducto({ producto }: PropsTarjeta) {
  const { agregar } = useCarrito()
  const agotado = producto.stock === 0

  return (
    <article className="tarjeta-producto">
      <Link to={`/productos/${producto.id}`} className="tarjeta-imagen">
        <img src={producto.imagenUrl} alt={producto.nombre} loading="lazy" className={agotado ? 'agotado' : ''} />
        {agotado && <span className="insignia-agotado">Agotado</span>}
      </Link>
      <div className="tarjeta-cuerpo">
        <span className="etiqueta-categoria">{NOMBRE_CATEGORIA[producto.categoria]}</span>
        <Link to={`/productos/${producto.id}`} className="tarjeta-nombre">
          {producto.nombre}
        </Link>
        <span className="tarjeta-precio">{formatearPrecio(producto.precio)}</span>
        <button className="boton" disabled={agotado} onClick={() => agregar(producto, 1)}>
          {agotado ? 'Agotado' : 'Agregar al carrito →'}
        </button>
      </div>
    </article>
  )
}
