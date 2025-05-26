import { Module } from '@nestjs/common';
import { QuizzService } from './quizz.service';
import { QuizzController } from './quizz.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Quizz, QuizzSchema } from './entities/quizz.schema';

@Module({
  imports : [MongooseModule.forFeature([{name: Quizz.name, schema: QuizzSchema}])],
  providers: [QuizzService],
  controllers: [QuizzController]
})
export class QuizzModule {}
