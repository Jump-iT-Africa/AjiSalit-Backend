import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { CommandModule } from './command/command.module';
import { UserModule } from './user/user.module';
import { NotificationsModule } from './notifications/notifications.module';
import { NotificationsGateway } from './notifications/notifications.gateway';
import { SiteinfoModule } from './siteinfo/siteinfo.module';
import { ScheduleModule } from '@nestjs/schedule';
import { FlagModule } from './flag/flag.module';
// import { ThrottlerModule } from '@nestjs/throttler';
import { QuizzModule } from './quizz/quizz.module';



@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URL),
    CommandModule,
    UserModule,
    NotificationsModule,
    SiteinfoModule,
    ScheduleModule.forRoot(),
    FlagModule,
    // ThrottlerModule.forRoot({
    //   throttlers: [
    //     {
    //       ttl: 60000,
    //       limit: 10,
    //     },
    //   ],
    // }),
    QuizzModule,
  ],
  providers:[
    NotificationsGateway
  ]

})
export class AppModule {}