import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
  forwardRef,
} from "@nestjs/common";
import { CreateNotificationDto } from "./dto/create-notification.dto";
import { UpdateNotificationDto } from "./dto/update-notification.dto";
import {
  Notification,
  NotificationDocument,
} from "./entities/notification.schema";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { User, UserDocument } from "../user/entities/user.schema";
import { ObjectId } from "mongodb";
import { Server } from "socket.io";
import { WebSocketServer } from "@nestjs/websockets";
import { UserService } from "../user/user.service";
import { CommandService } from "../command/command.service";
import { Types } from "twilio/lib/rest/content/v1/content";
import { Console, error } from "console";
import axios from "axios";

@Injectable()
export class NotificationsService {
  private notifications = [];

  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
    private userService: UserService,
    @Inject(forwardRef(() => CommandService))
    private commandServide: CommandService
  ) {}

  async createNewNotification(
    recevierId,
    senderId,
    createNotificationDto: CreateNotificationDto
  ) {
    try {
      if (recevierId == undefined) {
        throw new UnprocessableEntityException("the reciever id is empty");
      }

      if (typeof recevierId === "string" && recevierId.length !== 24) {
        throw new BadRequestException(
          "invalid receiver ID format kindly check your id and try again"
        );
      }
      const recevier = await this.userService.findOne(recevierId);
      // console.log("receiverrrrrr",recevier)
      if (!recevier) {
        throw new NotFoundException("the reciever is not found");
      }
      const notification = {
        senderId: senderId,
        recipientId: recevierId,
        message: createNotificationDto.message,
        read: false,
      };

      let newNotification = new this.notificationModel(notification);
      let result = await newNotification.save();
      this.notifications.push(notification);

      if (!result) {
        throw new BadRequestException("please try again");
      }
      return result;
    } catch (e) {
      console.log("create notification", e);
      if (e instanceof NotFoundException) {
        throw new NotFoundException("the reciever Id not found try again ");
      }
      if (e instanceof UnprocessableEntityException) {
        throw new UnprocessableEntityException(
          "the reciever id should not be empty"
        );
      }
      throw new BadRequestException("ops smth went wrong");
    }
  }

  async sendPushNotification(
    to: string,
    title: string,
    body: string,
    data: any = {}
  ) {
    try {
      const message = {
        to,
        sound: "default",
        title,
        body,
        data,
      };

      const response = await axios.post(
        "https://exp.host/--/api/v2/push/send",
        message,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Expo response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error sending push notification:", error);
      throw error;
    }
  }

  async sendReminderNotification(infoUser) {
    try {
      let user = await this.userService.findOne(infoUser.id);
      if (!user) {
        throw new NotFoundException("the user not found");
      }
      let notificationReminder;
      console.log("woooooo", user);
      let expotoken = user?.expoPushToken;
      if (!expotoken) {
        throw new NotFoundException("Expo push notification of this user not found");
      }
      console.log("here's the user", user);
      if(infoUser.role == "client"){
      notificationReminder = await this.sendPushNotification(
        expotoken,
        `🕖  Mazal Makhditi talab dyalk !`,
        `Salam 👋, bghina gha nfkrouk Talab dailk kaytsnak  🚀 Dkhl l’app bash tchouf ljadid `
      );
            console.log("Happy notification clien", notificationReminder);

      }else if(infoUser == "company"){
      console.log("tessssssssssst from company", user);

        notificationReminder = await this.sendPushNotification(
          expotoken,
          `🕖 Petit rappel 😊 !`,
          `Salam 👋, tlab li 3andek f l’app tsala délai. B9a ghir tbdl status dyalo bach nkemlou l’process b naja7 ✅. Matnsach, l’image dyalek katsb9ek 😉 `
      );
            console.log("Happy notification com", notificationReminder);

      }

      console.log("Happy notification", notificationReminder);

      return notificationReminder;
    } catch (e) {
      if (e instanceof NotFoundException ) {
        throw e;
      }
      throw new BadRequestException("Ops Notification Not sent, something bad happend")
    }
  }

  async notificationCompleteOrder(orderId, senderInfo, recevierId) {
    try {
      const order = await this.commandServide.findOne(orderId, senderInfo);
      if (!order) {
        throw new NotFoundException("Order not found verify id again");
      }
      if (order.clientId == null) {
        return "there's no client added to send the notification";
      }
      if (recevierId == undefined) {
        throw new UnprocessableEntityException("the reciever id is empty");
      }
      const recevier = await this.userService.findOne(recevierId);
      if (!recevier) {
        throw new NotFoundException("the reciever Id is not valid");
      }

      let send = await this.createNewNotification(recevierId, senderInfo.id, {
        message: `Aji salit, khod l order dailk  #${orderId}`,
      });
      console.log(order);
      return send;
    } catch (e) {
      console.log("message error", e);
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
