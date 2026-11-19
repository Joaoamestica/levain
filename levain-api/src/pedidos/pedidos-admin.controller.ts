import { Controller, Get, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { Pedido } from './pedido.entity';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('admin/pedidos')
export class PedidosAdminController {
  constructor(@InjectRepository(Pedido) private pedidos: Repository<Pedido>) {}

  @Get()
  listar() {
    return this.pedidos.find({ order: { id: 'DESC' } });
  }
}
