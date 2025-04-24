"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const dotenv = require("dotenv");
const express = require("express");
const path_1 = require("path");
const notifications_gateway_1 = require("./notifications/notifications.gateway");
dotenv.config();
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use('/swagger', express.static((0, path_1.join)(__dirname, '..', 'node_modules', 'swagger-ui-dist')));
    app.useStaticAssets('public');
    app.useGlobalPipes(new common_1.ValidationPipe());
    const options = new swagger_1.DocumentBuilder()
        .setTitle('AjiSalit API ')
        .setDescription('AjiSalit is an app that help you track your orders and get them on time')
        .setVersion('1.0')
        .addServer('http://localhost:3000/', 'Local environment')
        .addBearerAuth()
        .addTag('ajisalit')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, options);
    swagger_1.SwaggerModule.setup('api', app, document);
    const notifgat = app.get(notifications_gateway_1.NotificationsGateway);
    app.enableCors({
        origin: '*',
        credentials: true,
    });
    await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
//# sourceMappingURL=main.js.map