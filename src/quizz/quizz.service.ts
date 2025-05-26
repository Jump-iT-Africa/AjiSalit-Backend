import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Quizz } from './entities/quizz.schema';
import { Model } from 'mongoose';
import { QuizzModule } from './quizz.module';

@Injectable()
export class QuizzService {
    constructor(@InjectModel(Quizz.name) private QuizzModel:Model<QuizzModule>){}
    async createQuizz (){
        
    }
    async updateQuiZZ(){

    }
    async findOne(){

    }
}
