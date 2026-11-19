import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Campo from '../components/Campo'
import MensajeError from '../components/MensajeError'
import { useCarrito } from '../context/CarritoContext'
import { crearPedido, mensajeDeError } from '../api/cliente'
import { esquemaCheckout } from '../schemas/checkout'
import type { ValoresCheckout } from '../schemas/checkout'
import { formatearPrecio } from '../utils/formato'
import { validar } from '../utils/validar'
import type { Errores } from '../utils/validar'

const VALORES_INICIALES: ValoresCheckout = {
  nombre: '',
  correo: '',
  direccion: '',
  numeroTarjeta: '',
  vencimiento: '',
  cvv: '',
}

const esperar = (milisegundos: number) => new Promise((resolver) => setTimeout(resolver, milisegundos))

export default function Checkout() {
  const { items, total, vaciar } = useCarrito()
  const navegar = useNavigate()

  const [valores, setValores] = useState(VALORES_INICIALES)
  const [errores, setErrores] = useState<Errores>({})
  const [errorServidor, setErrorServidor] = useState('')
  const [procesando, setProcesando] = useState(false)

  // Un solo manejador para todos los inputs: usa el atributo "name" de cada uno
  function manejarCambio(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setValores({ ...valores, [name]: value })
    setErrores({ ...errores, [name]: '' }) // borra el error de ese campo al escribir
  }

  async function manejarEnvio(e: FormEvent) {
    e.preventDefault()
    setErrorServidor('')

    const resultado = validar(esquemaCheckout, valores)
    if (resultado.errores) {
      setErrores(resultado.errores)
      return
    }

    setProcesando(true)
    try {
      await esperar(1500) // simula el tiempo que tarda un pago
      const pedido = await crearPedido({
        nombreCliente: resultado.datos.nombre,
        correoCliente: resultado.datos.correo,
        direccion: resultado.datos.direccion,
        items: items.map((item) => ({ productoId: item.productoId, cantidad: item.cantidad })),
      })
      vaciar()
      navegar(`/pedido/${pedido.id}`)
    } catch (error) {
      setErrorServidor(mensajeDeError(error))
      setProcesando(false)
    }
  }

  if (items.length === 0) {
    return (
      <section className="seccion centrado">
        <h1 className="titulo-pagina">Checkout</h1>
        <p className="estado">No tienes productos en el carrito.</p>
        <Link to="/productos" className="boton boton-ancho-auto">
          Ver productos →
        </Link>
      </section>
    )
  }

  return (
    <section className="seccion">
      <h1 className="titulo-pagina">Checkout</h1>

      <div className="carrito">
        <form className="formulario" onSubmit={manejarEnvio} noValidate>
          <h2>Datos de entrega</h2>
          <Campo etiqueta="Nombre completo" error={errores.nombre}>
            <input name="nombre" value={valores.nombre} onChange={manejarCambio} placeholder="Tu nombre" />
          </Campo>
          <Campo etiqueta="Correo" error={errores.correo}>
            <input name="correo" type="email" value={valores.correo} onChange={manejarCambio} placeholder="tu@correo.cl" />
          </Campo>
          <Campo etiqueta="Dirección" error={errores.direccion}>
            <input name="direccion" value={valores.direccion} onChange={manejarCambio} placeholder="Calle 123, comuna" />
          </Campo>

          <h2>Pago (simulado)</h2>
          <p className="nota">Usa datos falsos, por ejemplo 4242 4242 4242 4242. No se cobra nada.</p>
          <Campo etiqueta="Número de tarjeta" error={errores.numeroTarjeta}>
            <input
              name="numeroTarjeta"
              inputMode="numeric"
              value={valores.numeroTarjeta}
              onChange={manejarCambio}
              placeholder="4242 4242 4242 4242"
            />
          </Campo>
          <div className="fila-campos">
            <Campo etiqueta="Vencimiento" error={errores.vencimiento}>
              <input name="vencimiento" value={valores.vencimiento} onChange={manejarCambio} placeholder="MM/AA" />
            </Campo>
            <Campo etiqueta="CVV" error={errores.cvv}>
              <input name="cvv" inputMode="numeric" value={valores.cvv} onChange={manejarCambio} placeholder="123" />
            </Campo>
          </div>

          {errorServidor && <MensajeError mensaje={errorServidor} />}

          <button className="boton" type="submit" disabled={procesando}>
            {procesando ? 'Procesando pago...' : `Pagar ${formatearPrecio(total)}`}
          </button>
        </form>

        <aside className="resumen">
          <h2>Tu pedido</h2>
          {items.map((item) => (
            <div key={item.productoId} className="resumen-fila">
              <span>
                {item.cantidad} × {item.nombre}
              </span>
              <span>{formatearPrecio(item.precio * item.cantidad)}</span>
            </div>
          ))}
          <div className="resumen-fila resumen-total">
            <span>Total</span>
            <strong>{formatearPrecio(total)}</strong>
          </div>
        </aside>
      </div>
    </section>
  )
}
