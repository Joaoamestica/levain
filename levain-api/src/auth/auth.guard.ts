import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';

// Revisa que la petición traiga el header "Authorization: Bearer <token>"
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwt: JwtService) {}

  canActivate(contexto: ExecutionContext): boolean {
    const peticion = contexto.switchToHttp().getRequest<Request>();
    const [tipo, token] = (peticion.headers.authorization ?? '').split(' ');
    if (tipo !== 'Bearer' || !token) throw new UnauthorizedException('Falta iniciar sesión');

    try {
      this.jwt.verify(token);
      return true;
    } catch {
      throw new UnauthorizedException('Sesión inválida o vencida');
    }
  }
}
