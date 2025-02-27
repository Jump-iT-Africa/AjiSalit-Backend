import { Module } from '@nestjs/common';
import { CommandService } from './command.service';
import { CommandController } from './command.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Command, CommandSchema } from './entities/command.schema';

@Module({
  imports: [MongooseModule.forFeature([{name: Command.name, schema: CommandSchema}])],
  controllers: [CommandController],
  providers: [CommandService],
})
export class CommandModule {}
