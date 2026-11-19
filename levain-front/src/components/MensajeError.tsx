export default function MensajeError({ mensaje }: { mensaje: string }) {
  return <p className="estado estado-error">{mensaje}</p>
}
