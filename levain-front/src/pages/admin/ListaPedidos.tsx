import { useEffect, useState } from 'react'
import Cargando from '../../components/Cargando'
import MensajeError from '../../components/MensajeError'
import { useSesion } from '../../context/SesionContext'
import { adminObtenerPedidos, mensajeDeError } from '../../api/cliente'
import type { Pedido } from '../../tipos'
import { formatearFecha, formatearPrecio } from '../../utils/formato'

export default function ListaPedidos() {
  const { token } = useSesion()
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function cargarPedidos() {
      try {
        setPedidos(await adminObtenerPedidos(token ?? ''))
      } catch (e) {
        setError(mensajeDeError(e))
      } finally {
        setCargando(false)
      }
    }
    cargarPedidos()
  }, [token])

  return (
    <>
      <div className="admin-cabecera">
        <h1>Pedidos</h1>
      </div>

      {cargando && <Cargando />}
      {error && <MensajeError mensaje={error} />}
      {!cargando && !error && pedidos.length === 0 && <p className="estado">Todavía no hay pedidos.</p>}

      {pedidos.length > 0 && (
        <div className="tabla-contenedor">
          <table className="tabla">
            <thead>
              <tr>
                <th>N°</th>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>Productos</th>
                <th>Total</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((pedido) => (
                <tr key={pedido.id}>
                  <td>#{pedido.id}</td>
                  <td>{formatearFecha(pedido.creadoEn)}</td>
                  <td>
                    {pedido.nombreCliente}
                    <br />
                    <small>{pedido.correoCliente}</small>
                  </td>
                  <td>{pedido.items.map((item) => `${item.cantidad} × ${item.nombre}`).join(', ')}</td>
                  <td>{formatearPrecio(pedido.total)}</td>
                  <td>
                    <span className="estado-activo">{pedido.estado}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
