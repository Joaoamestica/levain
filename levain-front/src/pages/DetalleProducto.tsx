import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Cargando from '../components/Cargando'
import MensajeError from '../components/MensajeError'
import { useCarrito } from '../context/CarritoContext'
import { mensajeDeError, obtenerProducto } from '../api/cliente'
import type { Producto } from '../tipos'
import { formatearPrecio } from '../utils/formato'

export default function DetalleProducto() {
  const { id } = useParams() // el :id de la ruta /productos/:id
  const { agregar } = useCarrito()
  const navegar = useNavigate()

  const [producto, setProducto] = useState<Producto | null>(null)
  const [cantidad, setCantidad] = useState(1)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function cargarProducto() {
      try {
        setProducto(await obtenerProducto(id ?? ''))
      } catch (e) {
        setError(mensajeDeError(e))
      } finally {
        setCargando(false)
      }
    }
    cargarProducto()
  }, [id])

  if (cargando) return <Cargando />
  if (error || !producto) return <MensajeError mensaje={error || 'Producto no encontrado'} />

  const agotado = producto.stock === 0

  function manejarAgregar() {
    if (!producto) return
    agregar(producto, cantidad)
    navegar('/carrito')
  }

  return (
    <section className="seccion">
      <Link to="/productos" className="enlace-volver">
        ← Volver a productos
      </Link>

      <div className="detalle">
        <img className="detalle-imagen" src={producto.imagenUrl} alt={producto.nombre} />

        <div className="detalle-info">
          <span className="etiqueta-categoria">{producto.categoria === 'cafe' ? 'Café' : 'Panadería'}</span>
          <h1>{producto.nombre}</h1>
          <p className="detalle-precio">{formatearPrecio(producto.precio)}</p>
          <p className="detalle-descripcion">{producto.descripcion}</p>
          <p className="detalle-stock">{agotado ? 'Producto agotado' : `${producto.stock} unidades disponibles`}</p>

          {!agotado && (
            <div className="selector-cantidad">
              <button onClick={() => setCantidad(cantidad - 1)} disabled={cantidad <= 1}>
                −
              </button>
              <span>{cantidad}</span>
              <button onClick={() => setCantidad(cantidad + 1)} disabled={cantidad >= producto.stock}>
                +
              </button>
            </div>
          )}

          <button className="boton" disabled={agotado} onClick={manejarAgregar}>
            {agotado ? 'Agotado' : 'Agregar al carrito →'}
          </button>
        </div>
      </div>
    </section>
  )
}
