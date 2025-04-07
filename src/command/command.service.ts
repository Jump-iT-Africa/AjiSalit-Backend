import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from "mongoose"
import { CreateCommandDto } from './dto/create-command.dto';
import { UpdateCommandDto } from './dto/update-command.dto';
import mongoose from 'mongoose';
import { Command, CommandDocument } from './entities/command.schema';
import { User, UserDocument } from '../user/entities/user.schema'; // Import your User schema
import { ValidationOrder } from "../services/validationOrder"

@Injectable()
export class CommandService {
  constructor(
    @InjectModel(Command.name) private commandModel: Model<CommandDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>, // Inject User model
  ) { }
  
  async create(createCommandDto: CreateCommandDto, authentificatedId: string) {
    try {
      const existingOrder = await this.commandModel.findOne({qrCode : createCommandDto.qrCode}).exec();
      if(existingOrder){
        throw new ConflictException("هاد الكود مستعمل")
      }
      createCommandDto.companyId = new Types.ObjectId(authentificatedId);
      let newOrder = new this.commandModel(createCommandDto);
      let resultValidation = ValidationOrder(newOrder)
      // console.log("hshshshshshsh status", resultValidation)
      if (resultValidation !== "valide") {
        throw new UnprocessableEntityException(resultValidation);
      }
      let savingOrder = newOrder.save()
      if(!savingOrder){
        return "حاول مرة خرى"
      }
      return newOrder
    } catch (e) {
      if (e instanceof UnprocessableEntityException) {
        throw e;
      }else if (e instanceof ConflictException){
        throw e;
      }
      throw new BadRequestException(e.message)
    }
  }

  async scanedUserId(qrcode: string, userId:string){
    try{
      const updatedCommand = await this.commandModel.findOneAndUpdate({qrCode:qrcode},{clientId:userId},{new: true}).exec();
      if(!updatedCommand)
        throw new NotFoundException(" طلب مكاينش تأكد من رمز مرة أخرى")
      if (updatedCommand.clientId === userId) {
        throw new BadRequestException("عاود حول مسح  Qr مرة خرى");
      }
      return "مبروك تم مسح رمز بنجاح";
    }catch(e){
      // console.log(e)
      if(e instanceof NotFoundException){
        throw new NotFoundException(" طلب مكاينش تأكد من رمز مرة أخرى")
      }
      if(e instanceof BadRequestException){
        throw new BadRequestException("عاود حول مسح  Qr مرة خرى");
      }
      throw new BadRequestException("حاول مرة خرى")
    }

  }

  async findAll(userId: string, role: string) {
    try {
      let query = {}
      if (role == "client") {
        query = { clientId: userId }
      } else if (role == "company") {
        query = { companyId: userId }
      }
      
      const allOrders = await this.commandModel.find(query)
      
      if (allOrders.length == 0) {
        return "ماكين حتا طلب"
      }
      
      // Get all unique client IDs from orders
      const clientIds = [...new Set(
        allOrders
          .filter(order => order.clientId) // Filter out orders without clientId
          .map(order => order.clientId.toString())
      )]
      
      // If no client IDs found, return orders as is
      if (clientIds.length === 0) {
        return allOrders;
      }
      
      // Fetch all relevant user data at once
      const users = await this.userModel.find({ 
        _id: { $in: clientIds.map(id => new Types.ObjectId(id)) } 
      })
      
      // Create a map of user ID to user name
      const userMap = users.reduce((map, user) => {
        map[user._id.toString()] = user.name || "عميل غير معروف"
        return map
      }, {})
      
      // Add customer names to each order
      const ordersWithCustomerNames = allOrders.map(order => {
        const clientId = order.clientId ? order.clientId.toString() : null;
        return {
          ...order.toObject(),  // Convert mongoose document to plain object
          customerDisplayName: clientId ? (userMap[clientId] || "عميل غير معروف") : "عميل غير معروف"
        }
      })
      
      return ordersWithCustomerNames
    } catch (e) {
      console.log(e)
      throw new BadRequestException("حاول مرة خرى")
    }
  }

  async findOne(id : string, infoUser) {
    try{
        let query = {}
        if(infoUser.role == "client"){
          query = {clientId:infoUser.id}
        }else if (infoUser.role == "company"){
          query = {companyId:infoUser.id}
        }
        console.log(query);
        
        let order = await this.commandModel.findOne({...query}).exec()
        if(!order){
          throw new NotFoundException("ماكين حتا طلب")
        }
        return order
      
    }catch(e){
      if (e.name === 'CastError') {
        throw new BadRequestException("رقم ديال طلب خطء حاول مرة أخرى");
      }
      if(e instanceof NotFoundException){
        throw e;
      }
      throw new BadRequestException("حاول مرة خرى")
    }
  }

  async update(authentificatedId, id, updateCommandDto: UpdateCommandDto) {
    try {
      // Validate ID format first
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestException("رقم ديال طلب خطء حاول مرة أخرى");
      }
      
      const command = await this.commandModel.findById(id).exec();
      console.log(id, command);
      
      if (!command) {
        throw new NotFoundException("طلب ديالك مكاينش");
      }
      
      console.log("Authenticated ID:", authentificatedId);
      console.log("Command company ID:", command.companyId.toString());
      
      if (command.companyId.toString() !== authentificatedId) {
        throw new ForbiddenException("ممسموحش لك تبدل هاد طلب");
      }
      
      console.log("Update DTO:", JSON.stringify(updateCommandDto));
      
      const updatedCommand = await this.commandModel
        .findByIdAndUpdate(
          id, 
          updateCommandDto, 
          {new: true, runValidators: true}
        )
        .exec();
      
      console.log("Updated command:", updatedCommand);
      return updatedCommand;
    } catch(e) {
      console.log("Error type:", e.constructor.name);
      console.log("Full error:", e);
      
      if (e.name === 'CastError' || e.name === 'ValidationError') {
        throw new BadRequestException("رقم ديال طلب خطء حاول مرة أخرى");
      }
      if (e instanceof NotFoundException) {
        throw e;
      }
      if (e instanceof ForbiddenException) {
        throw e;
      }
      throw new BadRequestException(`حاول مرة خرى: ${e.message}`);
    }
  }

  async deleteOrder(id: string, userId) {
    try{
      let order = await this.commandModel.findById(id);
      if(!order){
        throw new NotFoundException("طلب ديالك مكاينش")
      }
      if(order.companyId.toString() !== userId){
        throw new ForbiddenException("ممسموحش لك تمسح هاد طلب")
      }
      let deleteOrder = await this.commandModel.findByIdAndDelete(id).exec();
      return {
        mess: "تم مسح طلب بنجاح",
        deleteOrder
      }
    }catch(e){
      console.log("there's an error",e)
      if (e.name === 'CastError') {
        throw new BadRequestException("رقم ديال طلب خطء حاول مرة أخرى");
      }
      if(e instanceof NotFoundException){
        throw new NotFoundException("طلب ديالك مكاينش")
      }
      if(e instanceof ForbiddenException){
        throw new ForbiddenException("ممسموحش لك تمسح هاد طلب")
      }
      throw new BadRequestException("حاول مرة خرى")
    }
  }



  async getCommandByQrCode(qrCode: string): Promise<Command> {
    try{
      
      console.log(`Service`);

      const command = await this.commandModel.findOne({ qrCode })
      .populate('companyId', 'name phoneNumber images qrCode price advancedAmount pickupDate status') 
      .exec();
      
    console.log(command);

    if (!command) {
      throw new NotFoundException('لم يتم العثور على الطلب');
    }
    
    return command;

    }catch(e)
    {
      console.log(e);
      throw new BadRequestException("حاول مرة خرى")
      
    }
  }
}
