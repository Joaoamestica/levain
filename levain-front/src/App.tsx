import { Route, Routes } from 'react-router-dom'
import LayoutPublico from './layouts/LayoutPublico'
import LayoutAdmin from './layouts/LayoutAdmin'
import RutaProtegida from './components/RutaProtegida'
import Inicio from './pages/Inicio'
import Catalogo from './pages/Catalogo'
import DetalleProducto from './pages/DetalleProducto'
import Carrito from './pages/Carrito'
import Checkout from './pages/Checkout'
import ConfirmacionPedido from './pages/ConfirmacionPedido'
import Login from './pages/admin/Login'
import ListaProductos from './pages/admin/ListaProductos'
import FormularioProducto from './pages/admin/FormularioProducto'
import ListaPedidos from './pages/admin/ListaPedidos'

export default function App() {
  return (
    <Routes>
      {/* Zona pública: todas comparten el LayoutPublico */}
      <Route element={<LayoutPublico />}>
        <Route path="/" element={<Inicio />} />
        <Route path="/productos" element={<Catalogo />} />
        <Route path="/productos/:id" element={<DetalleProducto />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/pedido/:id" element={<ConfirmacionPedido />} />
      </Route>

      {/* Zona privada */}
      <Route path="/admin/login" element={<Login />} />
      <Route element={<RutaProtegida />}>
        <Route element={<LayoutAdmin />}>
          <Route path="/admin/productos" element={<ListaProductos />} />
          <Route path="/admin/productos/nuevo" element={<FormularioProducto />} />
          <Route path="/admin/productos/:id/editar" element={<FormularioProducto />} />
          <Route path="/admin/pedidos" element={<ListaPedidos />} />
        </Route>
      </Route>

      <Route path="*" element={<p className="estado">Página no encontrada</p>} />
    </Routes>
  )
}
