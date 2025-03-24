import { forwardRef, Module } from '@nestjs/common';
import { CommandService } from './command.service';
import { CommandController } from './command.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Command, CommandSchema } from './entities/command.schema';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [MongooseModule.forFeature([{name: Command.name, schema: CommandSchema}]),forwardRef(() => NotificationsModule)],
  controllers: [CommandController],
  providers: [CommandService],
  exports:[CommandService]
})
export class CommandModule {}
