import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Cargando from '../../components/Cargando'
import MensajeError from '../../components/MensajeError'
import { useSesion } from '../../context/SesionContext'
import { adminEliminarProducto, adminObtenerProductos, mensajeDeError } from '../../api/cliente'
import type { Producto } from '../../tipos'
import { formatearPrecio } from '../../utils/formato'

export default function ListaProductos() {
  const { token } = useSesion()
  const [productos, setProductos] = useState<Producto[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function cargarProductos() {
      try {
        setProductos(await adminObtenerProductos(token ?? ''))
      } catch (e) {
        setError(mensajeDeError(e))
      } finally {
        setCargando(false)
      }
    }
    cargarProductos()
  }, [token])

  async function eliminar(producto: Producto) {
    if (!window.confirm(`¿Eliminar "${producto.nombre}"? Esta acción no se puede deshacer.`)) return

    try {
      await adminEliminarProducto(producto.id, token ?? '')
      // Sacamos el producto de la lista sin volver a pedirla al servidor
      setProductos(productos.filter((p) => p.id !== producto.id))
    } catch (e) {
      setError(mensajeDeError(e))
    }
  }

  return (
    <>
      <div className="admin-cabecera">
        <h1>Productos</h1>
        <Link to="/admin/productos/nuevo" className="boton boton-ancho-auto">
          + Nuevo producto
        </Link>
      </div>

      {cargando && <Cargando />}
      {error && <MensajeError mensaje={error} />}

      {!cargando && (
        <div className="tabla-contenedor">
          <table className="tabla">
            <thead>
              <tr>
                <th></th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {productos.map((producto) => (
                <tr key={producto.id}>
                  <td>
                    <img className="miniatura" src={producto.imagenUrl} alt={producto.nombre} />
                  </td>
                  <td>{producto.nombre}</td>
                  <td>{producto.categoria === 'cafe' ? 'Café' : 'Panadería'}</td>
                  <td>{formatearPrecio(producto.precio)}</td>
                  <td>{producto.stock}</td>
                  <td>
                    <span className={producto.activo ? 'estado-activo' : 'estado-inactivo'}>
                      {producto.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>
                    <div className="tabla-acciones">
                      <Link to={`/admin/productos/${producto.id}/editar`} className="enlace">
                        Editar
                      </Link>
                      <button className="boton-texto boton-peligro" onClick={() => eliminar(producto)}>
                        Eliminar
                      </button>
                    </div>
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
