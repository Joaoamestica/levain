import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

interface ValorSesion {
  token: string | null
  iniciarSesion: (token: string) => void
  cerrarSesion: () => void
}

const CLAVE_STORAGE = 'levain-token'

const SesionContext = createContext<ValorSesion | null>(null)

export function SesionProvider({ children }: { children: ReactNode }) {
  // Al abrir la página recuperamos el token guardado (si existe)
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(CLAVE_STORAGE))

  function iniciarSesion(nuevoToken: string) {
    localStorage.setItem(CLAVE_STORAGE, nuevoToken)
    setToken(nuevoToken)
  }

  function cerrarSesion() {
    localStorage.removeItem(CLAVE_STORAGE)
    setToken(null)
  }

  return <SesionContext.Provider value={{ token, iniciarSesion, cerrarSesion }}>{children}</SesionContext.Provider>
}

export function useSesion() {
  const contexto = useContext(SesionContext)
  if (!contexto) throw new Error('useSesion debe usarse dentro de SesionProvider')
  return contexto
}
