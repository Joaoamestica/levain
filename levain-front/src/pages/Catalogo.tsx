import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Cargando from '../components/Cargando'
import MensajeError from '../components/MensajeError'
import TarjetaProducto from '../components/TarjetaProducto'
import { mensajeDeError, obtenerProductos } from '../api/cliente'
import type { Producto } from '../tipos'

const FILTROS = [
  { valor: 'todos', nombre: 'Todos' },
  { valor: 'cafe', nombre: 'Café' },
  { valor: 'pan', nombre: 'Panadería' },
]

export default function Catalogo() {
  // Si venimos desde Inicio, la categoría llega en la URL (?categoria=pan)
  const [parametros] = useSearchParams()
  const [categoria, setCategoria] = useState(parametros.get('categoria') ?? 'todos')

  const [productos, setProductos] = useState<Producto[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  // Se vuelve a ejecutar cada vez que cambia la categoría elegida
  useEffect(() => {
    async function cargarProductos() {
      setCargando(true)
      setError('')
      try {
        const lista = await obtenerProductos(categoria === 'todos' ? undefined : categoria)
        setProductos(lista)
      } catch (e) {
        setError(mensajeDeError(e))
      } finally {
        setCargando(false)
      }
    }
    cargarProductos()
  }, [categoria])

  return (
    <section className="seccion">
      <span className="sobretitulo">Café &amp; Panadería</span>
      <h1 className="titulo-pagina">Productos</h1>

      <div className="filtros">
        {FILTROS.map((filtro) => (
          <button
            key={filtro.valor}
            className={categoria === filtro.valor ? 'filtro filtro-activo' : 'filtro'}
            onClick={() => setCategoria(filtro.valor)}
          >
            {filtro.nombre}
          </button>
        ))}
      </div>

      {cargando && <Cargando />}
      {error && <MensajeError mensaje={error} />}
      {!cargando && !error && productos.length === 0 && <p className="estado">No hay productos en esta categoría.</p>}

      <div className="grilla-productos">
        {productos.map((producto) => (
          <TarjetaProducto key={producto.id} producto={producto} />
        ))}
      </div>
    </section>
  )
}
