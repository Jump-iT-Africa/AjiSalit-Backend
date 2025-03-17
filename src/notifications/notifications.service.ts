import { BadRequestException, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Notification, NotificationDocument } from './entities/notification.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/user/entities/user.schema';
import { Server } from 'socket.io';
import { WebSocketServer } from '@nestjs/websockets';
import { UserService } from 'src/user/user.service';
import { CommandService } from 'src/command/command.service';

@Injectable()
export class NotificationsService {
  @WebSocketServer()
  private server: Server;
  private notifications = [];

  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
    private userService:UserService,
    private commandServide:CommandService
  ) { }

  async createNewNotification(recevierId, senderId, createNotificationDto: CreateNotificationDto) {
    try {
      if(recevierId == undefined){
        throw new UnprocessableEntityException("the reciever id is empty")
      }
      // console.log('+++++++',recevierId)
      const recevier = await this.userService.findOne(recevierId);
      if(!recevier){
        throw new NotFoundException("the reciever Id is not valid")
      }
      const notification = {
        senderId:senderId,
        recipientId:recevierId,
        message: createNotificationDto.message,
        read: false,
      }
      if (recevier && recevier.socketId) {
        this.server.to(recevier.socketId).emit('notification', notification);
      }
      let newNotification = new this.notificationModel(notification)
      let result = await newNotification.save()
      if(!result){
        throw new BadRequestException("please try again")
      }
      return result
    } catch (e) {
      console.log("create notification", e)
      if(e instanceof NotFoundException){
        throw new NotFoundException('the reciever Id not found try again ')
      }
      if(e instanceof UnprocessableEntityException){
        throw new UnprocessableEntityException("the reciever id should not be empty")
      } 
      throw new BadRequestException("ops smth went wrong")

    }
  }

  async notificationCompleteOrder(orderId, senderInfo,recevierId){
    try{
      if(recevierId == undefined){
        throw new UnprocessableEntityException("the reciever id is empty")
      }
      const recevier = await this.userService.findOne(recevierId);
      if(!recevier){
        throw new NotFoundException("the reciever Id is not valid")
      }
      const order = await this.commandServide.findOne(orderId,senderInfo)
      if(!order){
        throw new NotFoundException("Order not found verify id again")
      }
      let send
      console.log(order)
    }catch(e){
      console.log("message error", e)
    }
  }

  findAll() {
    return `This action returns all notifications`;
  }

  findOne(id: number) {
    return `This action returns a #${id} notification`;
  }

  update(id: number, updateNotificationDto: UpdateNotificationDto) {
    return `This action updates a #${id} notification`;
  }

  remove(id: number) {
    return `This action removes a #${id} notification`;
  }
}
