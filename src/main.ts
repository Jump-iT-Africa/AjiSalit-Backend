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
import awsLambdaFastify from '@fastify/aws-lambda';




let server: ReturnType<typeof awsLambdaFastify>;
dotenv.config();


async function createApp() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );
  // const app = await NestFactory.create(AppModule);
  // const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
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
  // await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
    await app.init(); 

   return app

}
export const handler = async (event: any, context: any, callback: any) => {
  if (!server) {
    const app = await createApp();
    server = awsLambdaFastify(app.getHttpAdapter().getInstance());
  }
  return server(event, context, callback);
};

async function bootstrap() {
  const app = await createApp();
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
  console.log(`Application is running on: ${await app.getUrl()}`);
}

if (process.env.IS_OFFLINE !== 'true') {
  bootstrap();
}

// bootstrap();
