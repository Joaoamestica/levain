import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ItemPedido } from './item-pedido.entity';

@Entity('pedidos')
export class Pedido {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombreCliente: string;

  @Column()
  correoCliente: string;

  @Column()
  direccion: string;

  @Column('int')
  total: number;

  @Column({ default: 'pagado' })
  estado: 'pagado';

  @CreateDateColumn()
  creadoEn: Date;

  @OneToMany(() => ItemPedido, (item) => item.pedido, { cascade: true, eager: true })
  items: ItemPedido[];
}
