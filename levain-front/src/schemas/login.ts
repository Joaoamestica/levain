import { z } from 'zod'

export const esquemaLogin = z.object({
  correo: z.email('Ingresa un correo válido'),
  clave: z.string().min(1, 'Ingresa tu clave'),
})
