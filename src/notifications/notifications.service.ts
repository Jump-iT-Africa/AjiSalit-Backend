import { BadRequestException, Inject, Injectable, NotFoundException, UnprocessableEntityException, forwardRef } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Notification, NotificationDocument } from './entities/notification.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User, UserDocument } from 'src/user/entities/user.schema';
import { ObjectId } from 'mongodb';
import { Server } from 'socket.io';
import { WebSocketServer } from '@nestjs/websockets';
import { UserService } from 'src/user/user.service';
import { CommandService } from 'src/command/command.service';
import { Types } from 'twilio/lib/rest/content/v1/content';
import { Console } from 'console';

@Injectable()
export class NotificationsService {
  private notifications = [];

  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
    private userService: UserService,
    @Inject(forwardRef(() => CommandService))
    private commandServide: CommandService
  ) { }

  async createNewNotification(recevierId, senderId, createNotificationDto: CreateNotificationDto) {
    try {
      if(recevierId == undefined){
        throw new UnprocessableEntityException("the reciever id is empty")
      }

      if (typeof recevierId === 'string' && recevierId.length !== 24) {
        throw new BadRequestException('invalid receiver ID format kindly check your id and try again');
      }
      const recevier = await this.userService.findOne(recevierId);
      // console.log("receiverrrrrr",recevier)
      if(!recevier){
        throw new NotFoundException("the reciever is not found")
      }
      const notification = {
        senderId:senderId,
        recipientId:recevierId,
        message: createNotificationDto.message,
        read: false,
      }
      
      let newNotification = new this.notificationModel(notification)
      let result = await newNotification.save()
      this.notifications.push(notification);

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
      const order = await this.commandServide.findOne(orderId,senderInfo)
      if(!order){
        throw new NotFoundException("Order not found verify id again")
      }
      if(order.clientId == null){
        return "there's no client added to send the notification"
      }
      if(recevierId == undefined){
        throw new UnprocessableEntityException("the reciever id is empty")
      }
      const recevier = await this.userService.findOne(recevierId);
      if(!recevier){
        throw new NotFoundException("the reciever Id is not valid")
      }

      let send = await this.createNewNotification(
        recevierId,
        senderInfo.id,
        {
          message: `Aji salit, khod l order dailk  #${orderId}`
        }
      );
      console.log(order)
      return send;
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
