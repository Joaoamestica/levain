import './entorno';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Producto } from './productos/producto.entity';
import { Pedido } from './pedidos/pedido.entity';
import { ItemPedido } from './pedidos/item-pedido.entity';
import { ProductosController } from './productos/productos.controller';
import { ProductosAdminController } from './productos/productos-admin.controller';
import { PedidosController } from './pedidos/pedidos.controller';
import { PedidosAdminController } from './pedidos/pedidos-admin.controller';
import { AuthController } from './auth/auth.controller';
import { AuthGuard } from './auth/auth.guard';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PUERTO),
      username: process.env.DB_USUARIO,
      password: process.env.DB_CLAVE,
      database: process.env.DB_NOMBRE,
      entities: [Producto, Pedido, ItemPedido],
      synchronize: true, // crea las tablas solas (solo para desarrollo)
    }),
    TypeOrmModule.forFeature([Producto, Pedido, ItemPedido]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRETO,
      signOptions: { expiresIn: '8h' },
    }),
  ],
  controllers: [
    ProductosController,
    ProductosAdminController,
    PedidosController,
    PedidosAdminController,
    AuthController,
  ],
  providers: [AuthGuard],
})
export class AppModule {}
