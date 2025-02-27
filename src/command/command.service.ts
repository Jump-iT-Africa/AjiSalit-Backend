import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from "mongoose"
import { CreateCommandDto } from './dto/create-command.dto';
import { UpdateCommandDto } from './dto/update-command.dto';
import mongoose from 'mongoose';
import { Command, CommandDocument, } from './entities/command.schema';
import { Type } from 'class-transformer';
import {ValidationOrder} from "../services/validationOrder"

@Injectable()
export class CommandService {
  constructor(
    @InjectModel(Command.name) private commandModel: Model<CommandDocument>,
  ) { }
  create(createCommandDto: CreateCommandDto, authentificatedId: string) {
    try {
      createCommandDto.companyId = new Types.ObjectId(authentificatedId);
      let newOrder = new this.commandModel(createCommandDto);
      if(ValidationOrder(newOrder) !== "valide"){
        return ValidationOrder(newOrder)
      }
      let savingOrder = newOrder.save()
      if(!savingOrder){
        return "حاول مرة خرى"
      }
      return newOrder
    } catch (e) {
      console.log("ops an error",e)
      throw new BadRequestException("حاول مرة خرى")
    }
  }

  async scanedUserId(qrcode: string, userId:string){
    try{
      const updatedCommand = await this.commandModel.findOneAndUpdate({qrCodeUrl:qrcode},{clientId:userId},{new: true}).exec();
      if(!updatedCommand)
        return "حاول نسخQrcode مرة أخرى"
      return "mabrouk";
    }catch(e){
      console.log(e)
      throw new BadRequestException("حاول مرة خرى")
    }

  }

  async findAll(userId :string, role: string) {
    try{
      let query = {}
      if(role == "client"){
        query = {clientId:userId}
      }else if (role == "company"){
        query = {companyId:userId}

      }else {
        console.log(userId, role)
        return "No orders"
      }
      const allOrders = await this.commandModel.find(query)
      return allOrders
    }catch(e){
      console.log(e)
      throw new BadRequestException("حاول مرة خرى")
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} command`;
  }

  update(id: number, updateCommandDto: UpdateCommandDto) {
    return `This action updates a #${id} command`;
  }

  remove(id: number) {
    return `This action removes a #${id} command`;
  }
}
