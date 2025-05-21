import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Flag, FlagDocument } from './entities/flag.schema';
import { Model } from 'mongoose';
import { CreateFlagDtos } from './dtos/create-flag.dto';
import { UpdateFlagDto } from './dtos/update-flag.dto';

@Injectable()
export class FlagService {
    constructor(@InjectModel(Flag.name) private flagModel:Model<FlagDocument>){}
    async createFlag(createFlagDtos, adminId){
        try{
            createFlagDtos.title = createFlagDtos.title.trim()
            let isExist = await this.flagModel.findOne({title:createFlagDtos.title}).exec()
            if(isExist){
                throw new ConflictException("Flag with this name is already exists")
            }
            createFlagDtos.adminId = adminId;
            let newFlag = new this.flagModel(createFlagDtos)
            let result = await newFlag.save()
            if(!result){
                throw new BadRequestException("Ops the flag isn't added")
            }
            return result
        }catch(e){
            if(e instanceof ConflictException || e instanceof BadRequestException){
                throw e 
            }

        }
    }
    async updateFlag(updateFlagDto:UpdateFlagDto, id:string){
        try{
        let result = await this.flagModel.findByIdAndUpdate({_id:id}, updateFlagDto,{ new: true, runValidators: true }).exec();
        if(!result){
            throw new NotFoundException("The flag not found")
        }
        return result
        }catch(e){
            if(e.name == 'CastError'){
                throw new BadRequestException("Ops the id of flag is not valid id ")
            }
            if(e instanceof NotFoundException){
                throw e 
            }
        }
    }
    async getAllFlags(){
        try{
            let result = await this.flagModel.find().exec()
            if(!result || result.length == 0){
                throw new NotFoundException("No flags yet")
            }
            return result
        }catch(e){
            if(e instanceof NotFoundException){
                throw e
            }
        }
    }
}
