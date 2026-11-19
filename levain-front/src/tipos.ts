// Tipos que comparten todas las pantallas. Reflejan lo que responde la API.

export type Categoria = 'cafe' | 'pan'

export interface Producto {
  id: number
  nombre: string
  descripcion: string
  precio: number
  categoria: Categoria
  imagenUrl: string
  stock: number
  activo: boolean
}

// Lo que se envía al crear o editar un producto
export type DatosProducto = Omit<Producto, 'id'>

export interface ItemPedido {
  id: number
  productoId: number
  nombre: string
  cantidad: number
  precioUnitario: number
}

export interface Pedido {
  id: number
  nombreCliente: string
  correoCliente: string
  direccion: string
  total: number
  estado: 'pagado'
  creadoEn: string
  items: ItemPedido[]
}

// Un producto dentro del carrito
export interface ItemCarrito {
  productoId: number
  nombre: string
  precio: number
  imagenUrl: string
  stock: number
  cantidad: number
}

export interface DatosPedido {
  nombreCliente: string
  correoCliente: string
  direccion: string
  items: { productoId: number; cantidad: number }[]
}
