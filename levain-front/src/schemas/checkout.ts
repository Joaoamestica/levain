import { z } from 'zod'

export const esquemaCheckout = z.object({
  nombre: z.string().trim().min(3, 'Ingresa tu nombre completo'),
  correo: z.email('Ingresa un correo válido'),
  direccion: z.string().trim().min(5, 'Ingresa tu dirección de despacho'),
  // Datos de tarjeta FALSOS: solo se validan, nunca se envían
  numeroTarjeta: z
    .string()
    .transform((valor) => valor.replace(/\s/g, ''))
    .pipe(z.string().regex(/^\d{16}$/, 'El número de tarjeta debe tener 16 dígitos')),
  vencimiento: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Usa el formato MM/AA, por ejemplo 08/29'),
  cvv: z.string().regex(/^\d{3}$/, 'El CVV debe tener 3 dígitos'),
})

export type ValoresCheckout = z.input<typeof esquemaCheckout>
