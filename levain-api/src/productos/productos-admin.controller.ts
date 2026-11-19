import { Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { Producto } from './producto.entity';
import { ProductoDto } from './producto.dto';

// Todas las rutas de /admin/productos exigen estar logueado
@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('admin/productos')
export class ProductosAdminController {
  constructor(@InjectRepository(Producto) private productos: Repository<Producto>) {}

  @Get()
  listar() {
    return this.productos.find({ order: { id: 'ASC' } });
  }

  @Get(':id')
  async obtener(@Param('id', ParseIntPipe) id: number) {
    const producto = await this.productos.findOneBy({ id });
    if (!producto) throw new NotFoundException('Producto no encontrado');
    return producto;
  }

  @Post()
  crear(@Body() datos: ProductoDto) {
    return this.productos.save(this.productos.create({ activo: true, ...datos }));
  }

  @Put(':id')
  async actualizar(@Param('id', ParseIntPipe) id: number, @Body() datos: ProductoDto) {
    const producto = await this.productos.findOneBy({ id });
    if (!producto) throw new NotFoundException('Producto no encontrado');
    return this.productos.save({ ...producto, ...datos });
  }

  @Delete(':id')
  async eliminar(@Param('id', ParseIntPipe) id: number) {
    const resultado = await this.productos.delete(id);
    if (!resultado.affected) throw new NotFoundException('Producto no encontrado');
    return { mensaje: 'Producto eliminado' };
  }
}
