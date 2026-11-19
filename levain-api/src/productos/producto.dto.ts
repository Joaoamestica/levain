import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsIn, IsInt, IsNotEmpty, IsOptional, IsString, IsUrl, Min } from 'class-validator';
import type { Categoria } from './producto.entity';

export class ProductoDto {
  @ApiProperty({ example: 'Focaccia' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ example: 'Focaccia con aceite de oliva y romero.' })
  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @ApiProperty({ example: 3900, description: 'Pesos chilenos, entero' })
  @IsInt()
  @Min(1)
  precio: number;

  @ApiProperty({ enum: ['cafe', 'pan'], example: 'pan' })
  @IsIn(['cafe', 'pan'])
  categoria: Categoria;

  @ApiProperty({ example: 'https://images.pexels.com/photos/40321541/pexels-photo-40321541.jpeg' })
  @IsUrl()
  imagenUrl: string;

  @ApiProperty({ example: 12 })
  @IsInt()
  @Min(0)
  stock: number;

  @ApiPropertyOptional({ example: true, description: 'Si está inactivo no se ve en la tienda' })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
