import { Module } from '@nestjs/common';
import { FlagController } from './flag.controller';
import { FlagService } from './flag.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Flag, FlagSchema } from './entities/flag.schema';

@Module({
  imports: [MongooseModule.forFeature([
    {name:Flag.name, schema: FlagSchema}
  ])],
  controllers: [FlagController],
  providers: [FlagService]
})
export class FlagModule {}
