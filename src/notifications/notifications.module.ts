import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { NotificationsGateway } from './notifications.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { Notification, NotificationSchema } from './entities/notification.schema';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';
import { CommandModule } from 'src/command/command.module';
@Module({
  imports:[MongooseModule.forFeature([{name: Notification.name, schema: NotificationSchema}]),UserModule, CommandModule],
  controllers: [NotificationsController],
  providers: [NotificationsService,NotificationsGateway],
  exports: [NotificationsService,NotificationsGateway]
})
export class NotificationsModule {}
