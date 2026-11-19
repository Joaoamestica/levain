import { useEffect, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Campo from '../../components/Campo'
import Cargando from '../../components/Cargando'
import MensajeError from '../../components/MensajeError'
import { useSesion } from '../../context/SesionContext'
import { adminActualizarProducto, adminCrearProducto, adminObtenerProducto, mensajeDeError } from '../../api/cliente'
import { esquemaProducto } from '../../schemas/producto'
import { validar } from '../../utils/validar'
import type { Errores } from '../../utils/validar'

// En el formulario todo se escribe como texto; el precio y el stock se convierten a número al validar
const VALORES_INICIALES = {
  nombre: '',
  descripcion: '',
  precio: '',
  categoria: '',
  imagenUrl: '',
  stock: '',
  activo: true,
}

// Un campo vacío no es un número (Number('') daría 0 y pasaría la validación)
const aNumero = (texto: string) => (texto.trim() === '' ? NaN : Number(texto))

// Sirve para crear (/admin/productos/nuevo) y para editar (/admin/productos/:id/editar)
export default function FormularioProducto() {
  const { id } = useParams() // si hay id, estamos editando
  const { token } = useSesion()
  const navegar = useNavigate()

  const [valores, setValores] = useState(VALORES_INICIALES)
  const [errores, setErrores] = useState<Errores>({})
  const [errorServidor, setErrorServidor] = useState('')
  const [cargando, setCargando] = useState(Boolean(id))
  const [guardando, setGuardando] = useState(false)

  // Al editar, cargamos el producto y rellenamos el formulario
  useEffect(() => {
    if (!id) return

    async function cargarProducto() {
      try {
        const producto = await adminObtenerProducto(id ?? '', token ?? '')
        setValores({
          nombre: producto.nombre,
          descripcion: producto.descripcion,
          precio: String(producto.precio),
          categoria: producto.categoria,
          imagenUrl: producto.imagenUrl,
          stock: String(producto.stock),
          activo: producto.activo,
        })
      } catch (e) {
        setErrorServidor(mensajeDeError(e))
      } finally {
        setCargando(false)
      }
    }
    cargarProducto()
  }, [id, token])

  function manejarCambio(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target
    // El checkbox guarda true/false en vez de texto
    const nuevoValor = e.target instanceof HTMLInputElement && e.target.type === 'checkbox' ? e.target.checked : value
    setValores({ ...valores, [name]: nuevoValor })
    setErrores({ ...errores, [name]: '' })
  }

  async function manejarEnvio(e: FormEvent) {
    e.preventDefault()
    setErrorServidor('')

    const resultado = validar(esquemaProducto, {
      ...valores,
      precio: aNumero(valores.precio),
      stock: aNumero(valores.stock),
    })
    if (resultado.errores) {
      setErrores(resultado.errores)
      return
    }

    setGuardando(true)
    try {
      if (id) {
        await adminActualizarProducto(id, resultado.datos, token ?? '')
      } else {
        await adminCrearProducto(resultado.datos, token ?? '')
      }
      navegar('/admin/productos')
    } catch (error) {
      setErrorServidor(mensajeDeError(error))
      setGuardando(false)
    }
  }

  if (cargando) return <Cargando />

  return (
    <>
      <div className="admin-cabecera">
        <h1>{id ? 'Editar producto' : 'Nuevo producto'}</h1>
      </div>

      <form className="formulario formulario-admin" onSubmit={manejarEnvio} noValidate>
        <Campo etiqueta="Nombre" error={errores.nombre}>
          <input name="nombre" value={valores.nombre} onChange={manejarCambio} />
        </Campo>
        <Campo etiqueta="Descripción" error={errores.descripcion}>
          <textarea name="descripcion" rows={4} value={valores.descripcion} onChange={manejarCambio} />
        </Campo>
        <div className="fila-campos">
          <Campo etiqueta="Precio (CLP)" error={errores.precio}>
            <input name="precio" inputMode="numeric" value={valores.precio} onChange={manejarCambio} />
          </Campo>
          <Campo etiqueta="Stock" error={errores.stock}>
            <input name="stock" inputMode="numeric" value={valores.stock} onChange={manejarCambio} />
          </Campo>
        </div>
        <Campo etiqueta="Categoría" error={errores.categoria}>
          <select name="categoria" value={valores.categoria} onChange={manejarCambio}>
            <option value="">Selecciona una categoría</option>
            <option value="cafe">Café</option>
            <option value="pan">Panadería</option>
          </select>
        </Campo>
        <Campo etiqueta="URL de la imagen" error={errores.imagenUrl}>
          <input name="imagenUrl" value={valores.imagenUrl} onChange={manejarCambio} placeholder="https://images.pexels.com/..." />
        </Campo>
        {valores.imagenUrl.startsWith('http') && <img className="vista-previa" src={valores.imagenUrl} alt="Vista previa" />}

        <label className="campo-check">
          <input name="activo" type="checkbox" checked={valores.activo} onChange={manejarCambio} />
          Visible en la tienda
        </label>

        {errorServidor && <MensajeError mensaje={errorServidor} />}

        <div className="formulario-botones">
          <button className="boton boton-ancho-auto" type="submit" disabled={guardando}>
            {guardando ? 'Guardando...' : 'Guardar producto'}
          </button>
          <Link to="/admin/productos" className="boton-secundario">
            Cancelar
          </Link>
        </div>
      </form>
    </>
  )
}
