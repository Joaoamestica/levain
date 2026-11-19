import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { ItemCarrito, Producto } from '../tipos'

interface ValorCarrito {
  items: ItemCarrito[]
  totalProductos: number
  total: number
  agregar: (producto: Producto, cantidad: number) => void
  cambiarCantidad: (productoId: number, cantidad: number) => void
  quitar: (productoId: number) => void
  vaciar: () => void
}

const CLAVE_STORAGE = 'levain-carrito'

// Lee el carrito guardado; si no hay nada (o está dañado) parte vacío
function leerCarritoGuardado(): ItemCarrito[] {
  try {
    const guardado = localStorage.getItem(CLAVE_STORAGE)
    return guardado ? (JSON.parse(guardado) as ItemCarrito[]) : []
  } catch {
    return []
  }
}

const CarritoContext = createContext<ValorCarrito | null>(null)

export function CarritoProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ItemCarrito[]>(leerCarritoGuardado)

  // Cada vez que el carrito cambia, lo guardamos en localStorage
  useEffect(() => {
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(items))
  }, [items])

  // Todas las actualizaciones son inmutables: nunca modificamos el arreglo original

  function agregar(producto: Producto, cantidad: number) {
    const existente = items.find((item) => item.productoId === producto.id)

    if (existente) {
      // Ya estaba: creamos un arreglo nuevo con la cantidad actualizada (sin pasar del stock)
      setItems(
        items.map((item) =>
          item.productoId === producto.id
            ? { ...item, stock: producto.stock, cantidad: Math.min(item.cantidad + cantidad, producto.stock) }
            : item,
        ),
      )
    } else {
      // No estaba: lo agregamos al final con spread
      const nuevo: ItemCarrito = {
        productoId: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        imagenUrl: producto.imagenUrl,
        stock: producto.stock,
        cantidad: Math.min(cantidad, producto.stock),
      }
      setItems([...items, nuevo])
    }
  }

  function cambiarCantidad(productoId: number, cantidad: number) {
    setItems(
      items.map((item) =>
        item.productoId === productoId ? { ...item, cantidad: Math.max(1, Math.min(cantidad, item.stock)) } : item,
      ),
    )
  }

  function quitar(productoId: number) {
    setItems(items.filter((item) => item.productoId !== productoId))
  }

  function vaciar() {
    setItems([])
  }

  const totalProductos = items.reduce((suma, item) => suma + item.cantidad, 0)
  const total = items.reduce((suma, item) => suma + item.precio * item.cantidad, 0)

  return (
    <CarritoContext.Provider value={{ items, totalProductos, total, agregar, cambiarCantidad, quitar, vaciar }}>
      {children}
    </CarritoContext.Provider>
  )
}

// Hook para usar el carrito desde cualquier componente
export function useCarrito() {
  const contexto = useContext(CarritoContext)
  if (!contexto) throw new Error('useCarrito debe usarse dentro de CarritoProvider')
  return contexto
}
