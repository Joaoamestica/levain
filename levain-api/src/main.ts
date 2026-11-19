import './entorno';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function iniciar() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  // Valida automáticamente los datos que llegan según los DTO
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  // Documentación interactiva en http://localhost:4000/docs
  const configuracion = new DocumentBuilder()
    .setTitle('API Levain')
    .setDescription('Café y panadería. Las rutas /admin requieren token (obténlo en POST /auth/ingresar).')
    .setVersion('1.0')
    .addBearerAuth()
    .build()
  SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, configuracion));

  const puerto = process.env.API_PUERTO ?? 3001;
  await app.listen(puerto);
  console.log(`API Levain escuchando en http://localhost:${puerto}`);
}
iniciar();
