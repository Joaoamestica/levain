import './entorno';
import { DataSource } from 'typeorm';
import { Producto } from './productos/producto.entity';
import { Pedido } from './pedidos/pedido.entity';
import { ItemPedido } from './pedidos/item-pedido.entity';

// Imagen de Pexels a partir de su id
const foto = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop`;

const productos: Omit<Producto, 'id'>[] = [
  { nombre: 'Espresso', descripcion: 'Café corto e intenso, con crema espesa y notas a cacao.', precio: 2200, categoria: 'cafe', imagenUrl: foto(38523136), stock: 50, activo: true },
  { nombre: 'Latte', descripcion: 'Espresso con leche vaporizada y una capa fina de espuma.', precio: 3200, categoria: 'cafe', imagenUrl: foto(27666788), stock: 50, activo: true },
  { nombre: 'Cappuccino', descripcion: 'Partes iguales de espresso, leche y espuma cremosa.', precio: 3300, categoria: 'cafe', imagenUrl: foto(4913342), stock: 40, activo: true },
  { nombre: 'Latte helado', descripcion: 'Espresso doble sobre hielo y leche fría. Refrescante.', precio: 3500, categoria: 'cafe', imagenUrl: foto(18142624), stock: 30, activo: true },
  { nombre: 'Chocolate caliente', descripcion: 'Chocolate semiamargo derretido con leche, para días fríos.', precio: 3400, categoria: 'cafe', imagenUrl: foto(11043663), stock: 25, activo: true },
  { nombre: 'Bâtard', descripcion: 'Pan de masa madre de corteza crujiente y miga alveolada. 24 horas de fermentación.', precio: 4200, categoria: 'pan', imagenUrl: foto(36202913), stock: 20, activo: true },
  { nombre: 'Pan de campo', descripcion: 'Hogaza rústica de masa madre con harina integral.', precio: 4800, categoria: 'pan', imagenUrl: foto(8633662), stock: 15, activo: true },
  { nombre: 'Brioche', descripcion: 'Pan suave y mantecoso, ideal para el desayuno o con mermelada.', precio: 3800, categoria: 'pan', imagenUrl: foto(8599600), stock: 18, activo: true },
  { nombre: 'Croissant', descripcion: 'Hojaldre de mantequilla, dorado y en capas finas. Horneado cada mañana.', precio: 2500, categoria: 'pan', imagenUrl: foto(30403209), stock: 35, activo: true },
  { nombre: 'Rol de canela', descripcion: 'Masa esponjosa enrollada con canela y azúcar.', precio: 2900, categoria: 'pan', imagenUrl: foto(5662362), stock: 22, activo: true },
];

async function cargarDatos() {
  const baseDeDatos = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PUERTO),
    username: process.env.DB_USUARIO,
    password: process.env.DB_CLAVE,
    database: process.env.DB_NOMBRE,
    entities: [Producto, Pedido, ItemPedido],
    synchronize: true,
  });
  await baseDeDatos.initialize();

  const repositorio = baseDeDatos.getRepository(Producto);
  // Reinicia solo la tabla de productos para poder repetir el seed
  await baseDeDatos.query('TRUNCATE TABLE productos RESTART IDENTITY CASCADE');
  await repositorio.save(productos);

  console.log(`Seed listo: ${productos.length} productos cargados`);
  await baseDeDatos.destroy();
}
cargarDatos();
