export default function Cargando({ mensaje = 'Cargando...' }: { mensaje?: string }) {
  return <p className="estado">{mensaje}</p>
}
