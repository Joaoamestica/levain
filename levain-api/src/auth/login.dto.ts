import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'admin@levain.cl' })
  @IsEmail()
  correo: string;

  @ApiProperty({ example: 'admin123' })
  @IsString()
  @IsNotEmpty()
  clave: string;
}
