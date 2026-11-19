const formatoPesos = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' })

// 3200 -> "$3.200"
export const formatearPrecio = (precio: number) => formatoPesos.format(precio)

export const formatearFecha = (fecha: string) => new Date(fecha).toLocaleString('es-CL')
