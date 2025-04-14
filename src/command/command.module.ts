import { Module } from '@nestjs/common';
import { CommandService } from './command.service';
import { CommandController } from './command.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Command, CommandSchema } from './entities/command.schema';
import { User, UserSchema } from 'src/user/entities/user.schema';

@Module({
  imports: [MongooseModule.forFeature([
    {name: Command.name, schema: CommandSchema},
    { name: 'User', schema: UserSchema }])],
  controllers: [CommandController],
  providers: [CommandService],
})
export class CommandModule {}
