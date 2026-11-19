import { Controller, Get, NotFoundException, Param, ParseIntPipe, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { Repository } from 'typeorm';
import { Producto } from './producto.entity';

// Rutas públicas: solo muestran productos activos
@ApiTags('Público')
@Controller('productos')
export class ProductosController {
  constructor(@InjectRepository(Producto) private productos: Repository<Producto>) {}

  @Get()
  @ApiQuery({ name: 'categoria', required: false, enum: ['cafe', 'pan'] })
  listar(@Query('categoria') categoria?: string) {
    return this.productos.find({
      where: categoria ? { activo: true, categoria: categoria as Producto['categoria'] } : { activo: true },
      order: { id: 'ASC' },
    });
  }

  @Get(':id')
  async obtener(@Param('id', ParseIntPipe) id: number) {
    const producto = await this.productos.findOneBy({ id, activo: true });
    if (!producto) throw new NotFoundException('Producto no encontrado');
    return producto;
  }
}
