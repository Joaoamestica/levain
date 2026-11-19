import { z } from 'zod'

export const esquemaProducto = z.object({
  nombre: z.string().trim().min(3, 'El nombre debe tener al menos 3 caracteres'),
  descripcion: z.string().trim().min(10, 'La descripción debe tener al menos 10 caracteres'),
  precio: z
    .number({ error: 'El precio debe ser un número' })
    .int('El precio debe ser un número entero')
    .min(1, 'El precio debe ser mayor a 0'),
  categoria: z.enum(['cafe', 'pan'], { error: 'Elige una categoría' }),
  imagenUrl: z.url('Ingresa una URL válida, por ejemplo https://images.pexels.com/...'),
  stock: z
    .number({ error: 'El stock debe ser un número' })
    .int('El stock debe ser un número entero')
    .min(0, 'El stock no puede ser negativo'),
  activo: z.boolean(),
})
