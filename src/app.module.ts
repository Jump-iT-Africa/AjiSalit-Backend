import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { CommandModule } from './command/command.module';
import { UserModule } from './user/user.module';
import { NotificationsModule } from './notifications/notifications.module';
import { NotificationsGateway } from './notifications/notifications.gateway';


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URL),
    CommandModule,
    UserModule,
    NotificationsModule,    
  ],
  providers:[
    NotificationsGateway

  ]

})
export class AppModule {}