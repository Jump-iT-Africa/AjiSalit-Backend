import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import * as express from 'express';
import { join } from 'path';
import { NotificationsGateway } from './notifications/notifications.gateway';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import fastifyMultipart from '@fastify/multipart';



dotenv.config();

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
  app.use('/swagger', express.static(join(__dirname, '..', 'node_modules', 'swagger-ui-dist')));
  app.useStaticAssets({
    root: join(__dirname, '..', 'public'),
    prefix: '/public/', 
  });

  app.useGlobalPipes(new ValidationPipe());
  const options = new DocumentBuilder()
  .setTitle('AjiSalit API ')
  .setDescription('AjiSalit is an app that help you track your orders and get them on time')
  .setVersion('1.0')
  // .addServer('http://localhost:3000/', 'Local environment')
  .addServer('https://api.ajisalit.com/', 'Production')

  .addBearerAuth()
  .addTag('ajisalit')
  .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  const notifgat = app.get(NotificationsGateway)
  // setInterval(()=>notifgat.handleNotification())

  // await app.listen(process.env.PORT ?? 3000);
  app.enableCors({
    origin: '*', 
    credentials: true,
  });
  await app.register(fastifyMultipart);
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');

}
bootstrap();
