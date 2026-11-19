import type { DatosPedido, DatosProducto, Pedido, Producto } from '../tipos'

// Dirección de la API (el backend NestJS)
const URL_API = 'http://localhost:4000'

// Hace la petición y, si la API responde con error, lanza un Error con su mensaje
async function pedir<T>(ruta: string, opciones: RequestInit = {}, token?: string): Promise<T> {
  const respuesta = await fetch(`${URL_API}${ruta}`, {
    ...opciones,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })

  const datos: unknown = await respuesta.json().catch(() => null)

  if (!respuesta.ok) {
    // Nest devuelve { message: string | string[] }
    const mensaje = (datos as { message?: string | string[] } | null)?.message
    throw new Error(Array.isArray(mensaje) ? mensaje.join(', ') : (mensaje ?? 'Ocurrió un error inesperado'))
  }
  return datos as T
}

// Para mostrar el mensaje de un error capturado en un catch
export function mensajeDeError(error: unknown): string {
  if (error instanceof TypeError) return 'No se pudo conectar con el servidor'
  return error instanceof Error ? error.message : 'Ocurrió un error inesperado'
}

// ---------- Público ----------
export const obtenerProductos = (categoria?: string) =>
  pedir<Producto[]>(categoria ? `/productos?categoria=${categoria}` : '/productos')

export const obtenerProducto = (id: string) => pedir<Producto>(`/productos/${id}`)

export const crearPedido = (datos: DatosPedido) =>
  pedir<Pedido>('/pedidos', { method: 'POST', body: JSON.stringify(datos) })

export const obtenerPedido = (id: string) => pedir<Pedido>(`/pedidos/${id}`)

// ---------- Admin ----------
export const ingresar = (correo: string, clave: string) =>
  pedir<{ token: string }>('/auth/ingresar', { method: 'POST', body: JSON.stringify({ correo, clave }) })

export const adminObtenerProductos = (token: string) => pedir<Producto[]>('/admin/productos', {}, token)

export const adminObtenerProducto = (id: string, token: string) =>
  pedir<Producto>(`/admin/productos/${id}`, {}, token)

export const adminCrearProducto = (datos: DatosProducto, token: string) =>
  pedir<Producto>('/admin/productos', { method: 'POST', body: JSON.stringify(datos) }, token)

export const adminActualizarProducto = (id: string, datos: DatosProducto, token: string) =>
  pedir<Producto>(`/admin/productos/${id}`, { method: 'PUT', body: JSON.stringify(datos) }, token)

export const adminEliminarProducto = (id: number, token: string) =>
  pedir<{ mensaje: string }>(`/admin/productos/${id}`, { method: 'DELETE' }, token)

export const adminObtenerPedidos = (token: string) => pedir<Pedido[]>('/admin/pedidos', {}, token)
