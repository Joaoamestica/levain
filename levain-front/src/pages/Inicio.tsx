import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Cargando from '../components/Cargando'
import MensajeError from '../components/MensajeError'
import TarjetaProducto from '../components/TarjetaProducto'
import { mensajeDeError, obtenerProductos } from '../api/cliente'
import type { Producto } from '../tipos'

const foto = (id: number, ancho: number, alto: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${ancho}&h=${alto}&fit=crop`

const CATEGORIAS = [
  { valor: 'cafe', nombre: 'Café', imagen: foto(27666788, 600, 600) },
  { valor: 'pan', nombre: 'Panadería', imagen: foto(30403209, 600, 600) },
]

export default function Inicio() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  // Se ejecuta una vez, cuando la página aparece en pantalla
  useEffect(() => {
    async function cargarProductos() {
      try {
        const lista = await obtenerProductos()
        setProductos(lista.slice(0, 4)) // mostramos solo los primeros 4
      } catch (e) {
        setError(mensajeDeError(e))
      } finally {
        setCargando(false)
      }
    }
    cargarProductos()
  }, [])

  return (
    <>
      <section className="hero">
        <div className="hero-texto">
          <span className="sobretitulo">Café &amp; Panadería artesanal</span>
          <h1>Pan de masa madre y buen café, recién hechos cada día</h1>
          <p>Espresso, brioche, croissants y bâtard — directo del horno a tu mesa.</p>
          <Link to="/productos" className="boton boton-ancho-auto">
            Ver productos →
          </Link>
        </div>
        <img className="hero-imagen" src={foto(8633662, 900, 700)} alt="Pan de masa madre recién horneado" />
      </section>

      <section className="seccion">
        <h2>Categorías</h2>
        <div className="grilla-categorias">
          {CATEGORIAS.map((categoria) => (
            <Link key={categoria.valor} to={`/productos?categoria=${categoria.valor}`} className="tarjeta-categoria">
              <img src={categoria.imagen} alt={categoria.nombre} />
              <span>{categoria.nombre}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="seccion">
        <div className="seccion-cabecera">
          <h2>Más vendidos</h2>
          <Link to="/productos" className="enlace">
            Ver todos →
          </Link>
        </div>
        {cargando && <Cargando />}
        {error && <MensajeError mensaje={error} />}
        <div className="grilla-productos">
          {productos.map((producto) => (
            <TarjetaProducto key={producto.id} producto={producto} />
          ))}
        </div>
      </section>
    </>
  )
}
