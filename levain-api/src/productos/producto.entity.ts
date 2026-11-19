import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export type Categoria = 'cafe' | 'pan';

@Entity('productos')
export class Producto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column('text')
  descripcion: string;

  // Precio en pesos chilenos, siempre entero
  @Column('int')
  precio: number;

  @Column()
  categoria: Categoria;

  @Column()
  imagenUrl: string;

  @Column('int')
  stock: number;

  @Column({ default: true })
  activo: boolean;
}
