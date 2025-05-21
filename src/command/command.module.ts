import { forwardRef, Module } from '@nestjs/common';
import { CommandService } from './command.service';
import { CommandController } from './command.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Command, CommandSchema } from './entities/command.schema';
import { NotificationsModule } from '../notifications/notifications.module';
import { User, UserSchema } from '../user/entities/user.schema';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [MongooseModule.forFeature([
    {name: Command.name, schema: CommandSchema},
    { name: User.name, schema: UserSchema }]), forwardRef(() => NotificationsModule),    HttpModule,
    ConfigModule],
  controllers: [CommandController],
  providers: [CommandService],
  exports:[CommandService]
})
export class CommandModule {}
