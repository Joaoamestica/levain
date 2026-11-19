import type { z } from 'zod'

export type Errores = Record<string, string>

type Resultado<T> = { datos: T; errores: null } | { datos: null; errores: Errores }

// Valida con un esquema Zod y devuelve un mensaje de error por campo
export function validar<T>(esquema: z.ZodType<T>, valores: unknown): Resultado<T> {
  const resultado = esquema.safeParse(valores)
  if (resultado.success) return { datos: resultado.data, errores: null }

  const errores: Errores = {}
  for (const problema of resultado.error.issues) {
    const campo = String(problema.path[0])
    // Si un campo tiene varios errores, mostramos solo el primero
    if (!errores[campo]) errores[campo] = problema.message
  }
  return { datos: null, errores }
}
