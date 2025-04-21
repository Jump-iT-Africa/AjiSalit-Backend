import { BadRequestException, ConflictException, ForbiddenException, Inject, Injectable, NotFoundException, UnprocessableEntityException, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from "mongoose"
import { CreateCommandDto } from './dto/create-command.dto';
import { UpdateCommandDto } from './dto/update-command.dto';
import mongoose from 'mongoose';
import { Command, CommandDocument } from './entities/command.schema';
import {  User, UserDocument } from '../user/entities/user.schema';
import { ValidationOrder  } from "../services/validationOrder"
import { NotificationsGateway } from 'src/notifications/notifications.gateway';
import { NotificationsService } from 'src/notifications/notifications.service';


@Injectable()
export class CommandService {
  constructor(
    @InjectModel(Command.name) private commandModel: Model<CommandDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @Inject(forwardRef(() => NotificationsGateway))
    private readonly notificationsGateway: NotificationsGateway,
    private notificationsService: NotificationsService
  ) {}
  
  async create(createCommandDto: CreateCommandDto, authentificatedId: string) {
    try {
      const existingOrder = await this.commandModel.findOne({qrCode : createCommandDto.qrCode}).exec();

      if(existingOrder){
        throw new ConflictException("هاد الكود مستعمل")
      }

      createCommandDto.companyId = new Types.ObjectId(authentificatedId);
      let newOrder = new this.commandModel(createCommandDto);
      let resultValidation = ValidationOrder(newOrder)
      if (resultValidation !== "valide") {
        throw new UnprocessableEntityException(resultValidation);
      }

      let savingOrder = newOrder.save()
      if (!savingOrder) {
        return "try again"
      }

      return savingOrder
    } catch (e) {
      if (e instanceof UnprocessableEntityException) {
        throw e;
      } else if (e instanceof ConflictException) {
        throw e;
      }
      throw new BadRequestException(e.message)
    }
  }

  async scanedUserId(qrcode: string, userId:string, username:string) {
    try {
      const updateCommad = await this.commandModel.findOne({qrCode:qrcode})
      let companyData = await this.userModel.findById(updateCommad.companyId)
      if (!updateCommad)
        throw new NotFoundException("The order not found")
      console.log("client idddd", updateCommad.clientId, updateCommad)

      if(updateCommad.clientId !== null){
        throw new ConflictException("The qrCode is already scanned")
      }
      const updatedCommand = await this.commandModel.findOneAndUpdate({ qrCode: qrcode }, { clientId: userId }, { new: true }).exec();
      if(companyData.expoPushToken){
        let message = `Your qrCode has been was scanned successfully by ${username}`
        let notificationSender = await this.notificationsService.sendPushNotification(companyData.expoPushToken, "AjiSalit", message)
        console.log("ohhhhh la laa",notificationSender);
      }
      return "Congratulation the qrCode has been scanned successfully";
    } catch (e) {
      // console.log(e)
      if (e instanceof NotFoundException) {
        throw new NotFoundException("The order not found")
      }
      if (e instanceof BadRequestException) {
        throw new BadRequestException("Try to scan the QrCode again");
      }
      if(e instanceof ConflictException){
        throw new ConflictException("The qrCode is already scanned")
      }
      throw new BadRequestException("Try again")
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
      
      const clientIds = [...new Set(
        allOrders
          .filter(order => order.clientId) 
          .map(order => order.clientId.toString())
      )]

      const companyId = [...new Set(
        allOrders
          .filter(order => order.companyId) 
          .map(order => order.companyId.toString())
      )]
      
      if (clientIds.length === 0 || companyId.length === 0) {
        return allOrders;
      }
      
      const users = await this.userModel.find({ 
        _id: { $in: clientIds.map(id => new Types.ObjectId(id)) } 
      })


      const companies = await this.userModel.find({ 
        _id: { $in: companyId.map(id => new Types.ObjectId(id)) } 
      })
      
      const userMap = users.reduce((map, user) => {
        map[user._id.toString()] = {
          name: user.Fname || "عميل غير معروف",
        }
        return map
      }, {});

      const companyMap = companies.reduce((map, company) => {
        map[company._id.toString()] = {
          field: company.field || "مجال غير معروف"
        }
        return map
      }, {});
  
      const ordersWithCustomerNames = allOrders.map(order => {
        const clientId = order.clientId ? order.clientId.toString() : null;
        const plainOrder = order.toObject();
        const userData = clientId ? userMap[clientId] : null;
        const companyId = order.companyId ? order.companyId.toString() : null;
        const companyData = companyId ? companyMap[companyId] : null;

        return {
          ...plainOrder,
          customerDisplayName: userData?.name || "عميل غير معروف",
          customerField: companyData?.field || "مجال غير معروف"
        };
      });
      
      return ordersWithCustomerNames;
    } catch (e) {
      console.log(e);
      throw new BadRequestException("حاول مرة خرى");
    }
  }

  async findOne(id: string, infoUser) {
    try {
      let query: any = { _id: id };
      
      if (infoUser.role == "client") {
        query.clientId = infoUser.id;
      } else if (infoUser.role == "company") {
        query.companyId = infoUser.id;
      }
      
      console.log(query);
      
      let order = await this.commandModel.findOne(query).exec();
      if (!order) {
        throw new NotFoundException("ماكين حتا طلب");
      }
      
      return order;
    } catch (e) {
      if (e.name === 'CastError') {
        throw new BadRequestException("رقم ديال طلب خطء حاول مرة أخرى");
      }
      if  (e instanceof NotFoundException)  {
        throw e;
      }
      throw new BadRequestException("Try again")
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
      // console.log("authenticated ID:", authentificatedId);
      // console.log("command company ID:", command.companyId.toString());

      if (command.companyId.toString() !== authentificatedId) {
        throw new ForbiddenException("You are not allowed to update this oder");
      }

      const updatedCommand = await this.commandModel.findByIdAndUpdate( id, updateCommandDto,{ new: true, runValidators: true }).exec();
      if(updateCommandDto.status == "جاهزة للتسليم" && updatedCommand){
        console.log("Ops we are here ")
        let clientInfo = await this.userModel.findById(updatedCommand.clientId).exec();
        if(clientInfo.expoPushToken){
          let notificationSender = await this.notificationsService.sendPushNotification(clientInfo.expoPushToken, "AjiSalit", `سلام 👋، ${clientInfo?.Fname} أجي ساليت`)
          console.log("Here's my notification sender: ", notificationSender)
        }
      }
      console.log("Updated command:", updatedCommand);
      return updatedCommand;
    } catch (e) {
      console.log("error type:", e.constructor.name);
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

  async updateOrderToDoneStatus(userId, orderId, data){
    try{
      const command = await this.commandModel.findById(orderId).exec();
      console.log(orderId, command);

      if (!command) {
        throw new NotFoundException("طلب ديالك مكاينش");
      }

      if (command.companyId.toString() !== userId) {
        throw new ForbiddenException("You are not allowed to update this oder");
      }
      let result = await this.commandModel.findByIdAndUpdate(orderId, data,{new:true,runValidators:true}).exec()
      // console.log("++++++++++++", result)
      if(!result){
        throw new BadRequestException("smth bad happend")
      }else{
          const response = this.notificationsGateway.handleStatusNotification(
            orderId,
            result.clientId.toString(),
            userId
          )
          console.log(" Response is", response)
      }
      return result 
    }catch(e){
      console.log(e)
    }
  }
  async deleteOrder(id: string, userId) {
    try {
      let order = await this.commandModel.findById(id);
      if (!order) {
        throw new NotFoundException("طلب ديالك مكاينش")
      }
      if (order.companyId.toString() !== userId) {
        throw new ForbiddenException("You can't delete this order")
      }
      let deleteOrder = await this.commandModel.findByIdAndDelete(id).exec();
      return {
        mess: "The order was deleted successfully",
        deleteOrder
      }
    } catch (e) {
      console.log("there's an error", e)
      if (e.name === 'CastError') {
        throw new BadRequestException("رقم ديال طلب خطء حاول مرة أخرى");
      }
      if (e instanceof NotFoundException) {
        throw new NotFoundException("طلب ديالك مكاينش")
      }
      if (e instanceof ForbiddenException) {
        throw new ForbiddenException("You can't delete this order")
      }
      throw new BadRequestException("Try again")
    }
  }
  async getCommandByQrCode(qrCode: string): Promise<Command> {
    try {
      const command = await this.commandModel.findOne({ qrCode })
        .populate('companyId', 'name phoneNumber images qrCode price advancedAmount pickupDate status')
        .exec();

      console.log(command);

      if (!command) {
        throw new NotFoundException("The order is not found");
      }
      return command;

    } catch (e) {
      console.log(e);
      throw new BadRequestException("Try again")
    }
}
}

