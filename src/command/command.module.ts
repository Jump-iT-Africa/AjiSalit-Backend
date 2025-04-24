import { forwardRef, Module } from '@nestjs/common';
import { CommandService } from './command.service';
import { CommandController } from './command.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Command, CommandSchema } from './entities/command.schema';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { User, UserSchema } from 'src/user/entities/user.schema';

@Module({
  imports: [MongooseModule.forFeature([
    {name: Command.name, schema: CommandSchema},
    { name: User.name, schema: UserSchema }]), forwardRef(() => NotificationsModule)],
  controllers: [CommandController],
  providers: [CommandService],
  exports:[CommandService]
})
export class CommandModule {}
