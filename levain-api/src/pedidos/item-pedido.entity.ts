import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Pedido } from './pedido.entity';

@Entity('items_pedido')
export class ItemPedido {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productoId: number;

  @Column()
  nombre: string;

  @Column('int')
  cantidad: number;

  @Column('int')
  precioUnitario: number;

  @ManyToOne(() => Pedido, (pedido) => pedido.items, { onDelete: 'CASCADE' })
  pedido: Pedido;
}
