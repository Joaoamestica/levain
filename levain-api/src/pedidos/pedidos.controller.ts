import { BadRequestException, Body, Controller, Get, NotFoundException, Param, ParseIntPipe, Post } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { ApiTags } from '@nestjs/swagger';
import { DataSource, Repository } from 'typeorm';
import { Producto } from '../productos/producto.entity';
import { ItemPedido } from './item-pedido.entity';
import { Pedido } from './pedido.entity';
import { PedidoDto } from './pedido.dto';

@ApiTags('Público')
@Controller('pedidos')
export class PedidosController {
  constructor(
    @InjectRepository(Pedido) private pedidos: Repository<Pedido>,
    @InjectDataSource() private baseDeDatos: DataSource,
  ) {}

  // Pago simulado: no hay pasarela, el pedido queda directamente como 'pagado'
  @Post()
  crear(@Body() datos: PedidoDto) {
    // La transacción asegura que, si algo falla, no se descuente stock a medias
    return this.baseDeDatos.transaction(async (manager) => {
      let total = 0;
      const items: ItemPedido[] = [];

      for (const itemPedido of datos.items) {
        const producto = await manager.findOne(Producto, {
          where: { id: itemPedido.productoId, activo: true },
          lock: { mode: 'pessimistic_write' },
        });
        if (!producto) {
          throw new BadRequestException(`El producto ${itemPedido.productoId} no existe`);
        }
        if (producto.stock < itemPedido.cantidad) {
          throw new BadRequestException(`No hay stock suficiente de ${producto.nombre}`);
        }

        producto.stock -= itemPedido.cantidad;
        await manager.save(producto);

        // El precio sale de la base de datos, nunca del cliente
        total += producto.precio * itemPedido.cantidad;
        items.push(
          manager.create(ItemPedido, {
            productoId: producto.id,
            nombre: producto.nombre,
            cantidad: itemPedido.cantidad,
            precioUnitario: producto.precio,
          }),
        );
      }

      const pedido = manager.create(Pedido, {
        nombreCliente: datos.nombreCliente,
        correoCliente: datos.correoCliente,
        direccion: datos.direccion,
        total,
        estado: 'pagado',
        items,
      });
      return manager.save(pedido);
    });
  }

  @Get(':id')
  async obtener(@Param('id', ParseIntPipe) id: number) {
    const pedido = await this.pedidos.findOneBy({ id });
    if (!pedido) throw new NotFoundException('Pedido no encontrado');
    return pedido;
  }
}
