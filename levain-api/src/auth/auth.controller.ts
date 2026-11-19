import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiTags } from '@nestjs/swagger';
import { LoginDto } from './login.dto';

@ApiTags('Admin')
@Controller('auth')
export class AuthController {
  constructor(private jwt: JwtService) {}

  // Único usuario admin: sus credenciales viven en el .env
  @Post('ingresar')
  ingresar(@Body() datos: LoginDto) {
    const esAdmin = datos.correo === process.env.ADMIN_CORREO && datos.clave === process.env.ADMIN_CLAVE;
    if (!esAdmin) throw new UnauthorizedException('Correo o clave incorrectos');

    const token = this.jwt.sign({ correo: datos.correo });
    return { token };
  }
}
