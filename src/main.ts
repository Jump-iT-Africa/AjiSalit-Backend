import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import { NestExpressApplication } from '@nestjs/platform-express';


dotenv.config();

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  const options = new DocumentBuilder()
  .setTitle('AjiSalit API ')
  .setDescription('AjiSalit is an app that help you track your orders and get them on time')
  .setVersion('1.0')
  .addServer('http://localhost:3000/', 'Local environment')
  .addServer('https://www.ajisalit.com/', 'Production')
  .addTag('ajisalit')
  .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-ajisalit', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
