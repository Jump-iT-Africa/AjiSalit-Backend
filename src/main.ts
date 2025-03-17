import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as express from 'express';
import { join } from 'path';
import { NotificationsGateway } from './notifications/notifications.gateway';



dotenv.config();

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use('/swagger', express.static(join(__dirname, '..', 'node_modules', 'swagger-ui-dist')));
  app.useStaticAssets('public');

  app.useGlobalPipes(new ValidationPipe());
  const options = new DocumentBuilder()
  .setTitle('AjiSalit API ')
  .setDescription('AjiSalit is an app that help you track your orders and get them on time')
  .setVersion('1.0')
  .addServer('https://www.ajisalit.com/', 'Production')
  .addServer('http://localhost:3000/', 'Local environment')
  .addTag('ajisalit')
  .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  // const notifgat = app.get(NotificationsGateway)
  // setInterval(()=>notifgat.handleNotification())

  // await app.listen(process.env.PORT ?? 3000);
  app.enableCors({
    origin: '*', 
    credentials: true,
  });
  
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');

}
bootstrap();
