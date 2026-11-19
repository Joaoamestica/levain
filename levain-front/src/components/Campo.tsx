import type { ReactNode } from 'react'

interface PropsCampo {
  etiqueta: string
  error?: string
  children: ReactNode // aquí va el <input>, <select> o <textarea>
}

// Envuelve cualquier control de formulario con su etiqueta y su mensaje de error
export default function Campo({ etiqueta, error, children }: PropsCampo) {
  return (
    <div className="campo">
      <label>
        <span className="campo-etiqueta">{etiqueta}</span>
        {children}
      </label>
      {error && <span className="campo-error">{error}</span>}
    </div>
  )
}
