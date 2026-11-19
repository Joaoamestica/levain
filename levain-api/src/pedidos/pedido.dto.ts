import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsEmail, IsInt, IsNotEmpty, IsString, Min, ValidateNested } from 'class-validator';

export class ItemPedidoDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  productoId: number;

  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(1)
  cantidad: number;
}

export class PedidoDto {
  @ApiProperty({ example: 'Ana Pérez' })
  @IsString()
  @IsNotEmpty()
  nombreCliente: string;

  @ApiProperty({ example: 'ana@correo.cl' })
  @IsEmail()
  correoCliente: string;

  @ApiProperty({ example: 'Av. Providencia 1234, Santiago' })
  @IsString()
  @IsNotEmpty()
  direccion: string;

  @ApiProperty({ type: [ItemPedidoDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ItemPedidoDto)
  items: ItemPedidoDto[];
}
