import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Cargando from '../components/Cargando'
import MensajeError from '../components/MensajeError'
import { mensajeDeError, obtenerPedido } from '../api/cliente'
import type { Pedido } from '../tipos'
import { formatearFecha, formatearPrecio } from '../utils/formato'

export default function ConfirmacionPedido() {
  const { id } = useParams()
  const [pedido, setPedido] = useState<Pedido | null>(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function cargarPedido() {
      try {
        setPedido(await obtenerPedido(id ?? ''))
      } catch (e) {
        setError(mensajeDeError(e))
      } finally {
        setCargando(false)
      }
    }
    cargarPedido()
  }, [id])

  if (cargando) return <Cargando />
  if (error || !pedido) return <MensajeError mensaje={error || 'Pedido no encontrado'} />

  return (
    <section className="seccion confirmacion">
      <span className="confirmacion-icono">✓</span>
      <h1 className="titulo-pagina">¡Gracias por tu compra, {pedido.nombreCliente}!</h1>
      <p className="aviso-simulado">Pago simulado: no se realizó ningún cobro real.</p>

      <div className="resumen">
        <h2>Pedido #{pedido.id}</h2>
        <p className="nota">
          {formatearFecha(pedido.creadoEn)} · Estado: {pedido.estado}
        </p>
        <p className="nota">Despacho a: {pedido.direccion}</p>
        {pedido.items.map((item) => (
          <div key={item.id} className="resumen-fila">
            <span>
              {item.cantidad} × {item.nombre}
            </span>
            <span>{formatearPrecio(item.precioUnitario * item.cantidad)}</span>
          </div>
        ))}
        <div className="resumen-fila resumen-total">
          <span>Total</span>
          <strong>{formatearPrecio(pedido.total)}</strong>
        </div>
      </div>

      <Link to="/productos" className="boton boton-ancho-auto">
        Seguir comprando →
      </Link>
    </section>
  )
}
