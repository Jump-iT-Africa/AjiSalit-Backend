import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
  forwardRef,
} from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { CreateCommandDto } from "./dto/create-command.dto";
import { UpdateCommandDto } from "./dto/update-command.dto";
import mongoose from "mongoose";
import { Command, CommandDocument } from "./entities/command.schema";
import { User, UserDocument } from "../user/entities/user.schema";
import { ValidationOrder } from "../services/validationOrder";
import { NotificationsGateway } from "../notifications/notifications.gateway";
import { NotificationsService } from "../notifications/notifications.service";
import { validationPickUpdate } from "../services/validationPickUpdate";
import { Connection } from "mongoose";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { lastValueFrom } from "rxjs";

@Injectable()
export class CommandService {
  private readonly bunnyStorageUrl: string;
  private readonly bunnyAccessKey: string;
  private readonly bunnyStorageZone: string;
  constructor(
    @InjectConnection() private readonly connection: Connection,
    @InjectModel(Command.name) private commandModel: Model<CommandDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @Inject(forwardRef(() => NotificationsGateway))
    private readonly notificationsGateway: NotificationsGateway,
    private notificationsService: NotificationsService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}


 async uploadImageToBunny(file: Buffer, filename: string): Promise<string> {
  console.log("i m in uplaodddd")
    const storageZone = this.configService.get<string>('BUNNY_STORAGE_ZONE');
    const accessKey = this.configService.get<string>('BUNNY_ACCESS_KEY');
    const storageUrl = this.configService.get<string>('BUNNY_STORAGE_URL');
      const uniqueFilename = `${Date.now()}-${filename.replace(/\s/g, '_')}`;
    const url = `${storageUrl}/${storageZone}/${uniqueFilename}`;

    console.log("here's the storage zone", storageZone)
    
    try {
      const response = await lastValueFrom(
        this.httpService.put(
          url,
          file,
          {
            headers: {
              'AccessKey': accessKey,
              'Content-Type': 'application/octet-stream',
            },
          }
        )
      );
      
      if (response.status === 201) {
        return `https://${storageZone}.b-cdn.net/${uniqueFilename}`;
      } else {
        throw new Error(`Failed to upload to Bunny CDN: ${response.status}`);
      }
    } catch (error) {
      console.error('Error uploading to Bunny CDN:', error);
      throw new Error(`Bunny CDN upload failed: ${error.message}`);
    }
  }
  

  async create(createCommandDto: CreateCommandDto, authentificatedId: string, images) {
    const session = await this.connection.startSession();

    try {
      session.startTransaction();
      let companyOwner = await this.userModel
        .findById(authentificatedId)
        .session(session)
        .exec();
      if (companyOwner?.pocket <= 0) {
        throw new HttpException(
          "Ops you are poor, your balance is zero",
          HttpStatus.PAYMENT_REQUIRED
        );
      }
      const existingOrder = await this.commandModel
        .findOne({ qrCode: createCommandDto.qrCode })
        .exec();

      if (existingOrder) {
        throw new ConflictException("This code is already used");
      }

      if (images && images.length > 0) {
        const imageUrls: string[] = [];
        for (const file of images) {
          try {
            const imageUrl = await this.uploadImageToBunny(file.buffer, file.originalname);
            imageUrls.push(imageUrl);
          } catch (error) {
            console.error('Image upload failed:', error);
          }
        }
                createCommandDto.images = imageUrls;
      }
      createCommandDto.companyId = new Types.ObjectId(authentificatedId);
      let newOrder = new this.commandModel(createCommandDto);
      let resultValidation = ValidationOrder(newOrder);
      if (resultValidation !== "valide") {
        throw new UnprocessableEntityException(resultValidation);
      }

      let savingOrder = newOrder.save({ session });
      if (!savingOrder) {
        return "try again";
      }
      let updateCompanyOwnerPocket = await this.userModel.findByIdAndUpdate(
        { _id: authentificatedId },
        { pocket: companyOwner.pocket - 1 },
        { new: true, session }
      );
      if (updateCompanyOwnerPocket && savingOrder) {
        await session.commitTransaction();
        return savingOrder;
      }
    } catch (e) {
      await session.abortTransaction();
      if (
        e instanceof UnprocessableEntityException ||
        e instanceof ConflictException ||
        e instanceof HttpException
      ) {
        throw e;
      }
      console.log("ops new wonderful error", e);
      throw new BadRequestException(e.message);
    } finally {
      session.endSession();
    }
  }

  async scanedUserId(qrcode: string, userId: string, username: string) {
    try {
      const updateCommad = await this.commandModel.findOne({ qrCode: qrcode });
      let companyData = await this.userModel.findById(updateCommad.companyId);
      if (!updateCommad) throw new NotFoundException("The order not found");
      console.log("client idddd", updateCommad.clientId, updateCommad);

      if (updateCommad.clientId !== null) {
        throw new ConflictException("The qrCode is already scanned");
      }
      const updatedCommand = await this.commandModel
        .findOneAndUpdate(
          { qrCode: qrcode },
          { clientId: userId },
          { new: true }
        )
        .exec();
      if (companyData.expoPushToken) {
        let message = `Your qrCode has been was scanned successfully by ${username}`;
        let notificationSender =
          await this.notificationsService.sendPushNotification(
            companyData.expoPushToken,
            "AjiSalit",
            message
          );
        console.log("ohhhhh la laa", notificationSender);
      }
      return "Congratulation the qrCode has been scanned successfully";
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw new NotFoundException("The order not found");
      }
      if (e instanceof BadRequestException) {
        throw new BadRequestException("Try to scan the QrCode again");
      }
      if (e instanceof ConflictException) {
        throw new ConflictException("The qrCode is already scanned");
      }
      throw new BadRequestException("Try again");
    }
  }

  async findAll(userId: string, role: string) {
    try {
      let query = {};
      let allOrders;

      console.log("I m here ");
      if (role == "admin") {
        const allOrders = await this.commandModel
          .find()
          .populate({ path: "companyId", select: "companyName field" })
          .exec();
        if (!allOrders || allOrders.length == 0) {
          throw new NotFoundException("No orders found");
        }
        return allOrders;
      }
      if (role == "client") {
        query = { clientId: userId };
        const allOrders = await this.commandModel
          .find(query)
          .populate({
            path: "companyId",
            select: "companyName field phoneNumber",
          })
          .exec();
        console.log("there's an error", allOrders);
        if (!allOrders || allOrders.length == 0) {
          throw new NotFoundException("No orders found");
        }
        return allOrders;
      } else if (role == "company") {
        query = { companyId: userId };
        const allOrders = await this.commandModel
          .find(query)
          .populate({ path: "clientId", select: "Fname Lname phoneNumber" })
          .exec();
        console.log("Here's all the orders", allOrders);
        if (!allOrders || allOrders.length == 0) {
          throw new NotFoundException("No orders found");
        }

        return allOrders;
      }
      console.log("here are the orders", allOrders);
    } catch (e) {
      console.log(e);
      if (e instanceof NotFoundException) {
        throw e;
      }
      throw new BadRequestException("Please try again");
    }
  }

  async findOne(id: string, infoUser) {
    try {
      console.log("here's the id of user");
      let query: any = { _id: id };

      if (infoUser.role == "client") {
        query.clientId = infoUser.id;
      } else if (infoUser.role == "company") {
        query.companyId = infoUser.id;
      }

      let order = await this.commandModel
        .findOne(query)
        .populate({ path: "companyId", select: "companyName field" })
        .exec();
      console.log("there's an order", order);
      if (!order) {
        throw new NotFoundException("No order found");
      }

      return order;
    } catch (e) {
      if (e.name === "CastError") {
        throw new BadRequestException("The id of this order is not correct");
      }
      if (e instanceof NotFoundException) {
        throw e;
      }
      throw new BadRequestException("Try again");
    }
  }

  async update(authentificatedId, id, updateCommandDto: UpdateCommandDto) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestException("The id of this order is not correct");
      }

      const command = await this.commandModel.findById(id).exec();
      console.log(id, command);

      if (!command) {
        throw new NotFoundException("The order not found");
      }

      if (command.companyId.toString() !== authentificatedId) {
        throw new ForbiddenException("You are not allowed to update this oder");
      }

      const updatedCommand = await this.commandModel
        .findByIdAndUpdate(id, updateCommandDto, {
          new: true,
          runValidators: true,
        })
        .exec();
      let clientInfo = await this.userModel
        .findById(updatedCommand.clientId)
        .exec();
      let companyInfo = await this.userModel
        .findById(updatedCommand.companyId)
        .exec();

      if (clientInfo && clientInfo.expoPushToken) {
        let notificationSender =
          await this.notificationsService.sendPushNotification(
            clientInfo.expoPushToken,
            ` 🛎️ Talabek tbdel !`,
            `Salam ${clientInfo?.Fname} 👋, Talab dyalk Tbdel mn 3nd ${companyInfo.companyName !== null ? companyInfo.companyName : companyInfo.field} 🚀 Dkhl l’app bash tchouf ljadid `
          );
        console.log("Here's my notification sender: ", notificationSender);
      }
      return updatedCommand;
    } catch (e) {
      console.log("error type:", e.constructor.name);
      console.log("Full error:", e);

      if (e.name === "CastError" || e.name === "ValidationError") {
        throw new BadRequestException("The id of this order is not correct");
      }
      if (e instanceof NotFoundException) {
        throw e;
      }
      if (e instanceof ForbiddenException) {
        throw e;
      }
      throw new BadRequestException(`try again : ${e.message}`);
    }
  }

  async updateOrderToDoneStatus(userId, orderId, data) {
    try {
      const command = await this.commandModel.findById(orderId).exec();
      if (!command) {
        throw new NotFoundException("The command not found");
      }
      if (command.companyId.toString() !== userId) {
        throw new ForbiddenException("You are not allowed to update this oder");
      }

      let result = await this.commandModel
        .findByIdAndUpdate(orderId, data, { new: true })
        .exec();
      let clientInfo = await this.userModel.findById(command.clientId).exec();
      let companyInfo = await this.userModel.findById(command.companyId).exec();
      // console.log(clientInfo)
      console.log("ohhh a result", result, data);
      if (data.status == "جاهزة للتسليم") {
        if (clientInfo && clientInfo.expoPushToken && result) {
          let notificationSender =
            await this.notificationsService.sendPushNotification(
              clientInfo.expoPushToken,
              `📦Talabek wajed !`,
              `Salam ${clientInfo?.Fname} 👋, Ajiii Salit Talab dyalk wajed 3nd ${companyInfo.companyName !== null ? companyInfo.companyName : companyInfo.field} 🚀 `
            );
          console.log("Here's my notification sender: ", notificationSender);
        }
      } else if (data.status == "تم تسليم") {
        if (clientInfo && clientInfo.expoPushToken && result) {
          let notificationSender =
            await this.notificationsService.sendPushNotification(
              clientInfo.expoPushToken,
              `🎉 Chokran ala ti9a dailk fina `,
              `Salaaam ${clientInfo?.Fname} 👋, chokran 7it khdemti b l'application dyalna, mansash tkhli lina review https://shorturl.at/s9Tc2🚀 `
            );
          console.log("Here's my notification sender: ", notificationSender);
        }
      }

      return result;
    } catch (e) {
      if (
        e instanceof NotFoundException ||
        e instanceof ForbiddenException ||
        e instanceof BadRequestException
      ) {
        throw e;
      }
      throw new BadRequestException("Ops Something went wrong");
    }
  }

  async updateOrderpickUpDate(userId, orderId, data) {
    try {
      const command = await this.commandModel.findById(orderId).exec();
      if (!command) {
        throw new NotFoundException("The command not found");
      }
      if (command.companyId.toString() !== userId) {
        throw new ForbiddenException("You are not allowed to update this oder");
      }
      let validateDate = validationPickUpdate(data);
      if (validateDate !== "valid") {
        throw new UnprocessableEntityException(validateDate);
      }

      let result = await this.commandModel
        .findByIdAndUpdate(orderId, data, { new: true, runValidators: true })
        .exec();
      if (!result) {
        throw new BadRequestException("Ops try to update it again");
      }
      let clientInfo = await this.userModel.findById(command.clientId).exec();
      let companyInfo = await this.userModel.findById(command.companyId).exec();
      if (clientInfo && clientInfo.expoPushToken && result) {
        console.log("info user:", clientInfo, clientInfo.expoPushToken, result);
        let notificationSender =
          await this.notificationsService.sendPushNotification(
            clientInfo.expoPushToken,
            `🕒 Tarikh l'istilam tbdl !`,
            `Salam ${clientInfo?.Fname} 👋, Ajii t2ked mn tarikh el istilam jedid 📆 3nd ${companyInfo.companyName !== null ? companyInfo.companyName : companyInfo.field} 🚀 `
          );
        console.log("Here's my notification sender: ", notificationSender);
      }

      return result;
    } catch (e) {
      console.log("opsss", e);
      if (
        e instanceof NotFoundException ||
        e instanceof ForbiddenException ||
        e instanceof BadRequestException ||
        e instanceof UnprocessableEntityException
      ) {
        throw e;
      }
      throw new BadRequestException("Ops Something went wrong");
    }
  }

  async deleteOrder(id: string, userId) {
    try {
      let order = await this.commandModel.findById(id);
      if (!order) {
        throw new NotFoundException("The order is not found");
      }
      if (order.companyId.toString() !== userId) {
        throw new ForbiddenException("You can't delete this order");
      }
      let deleteOrder = await this.commandModel.findByIdAndDelete(id).exec();
      return {
        message: "The order was deleted successfully",
      };
    } catch (e) {
      console.log("there's an error", e);
      if (e.name === "CastError") {
        throw new BadRequestException("The id of this order is not correct");
      }
      if (e instanceof NotFoundException) {
        throw new NotFoundException("The order is not found");
      }
      if (e instanceof ForbiddenException) {
        throw new ForbiddenException("You can't delete this order");
      }
      throw new BadRequestException("Try again");
    }
  }

  async getCommandByQrCode(
    qrCode: string,
    userId?: string,
    role?: string
  ): Promise<any> {
    try {
      const command = await this.commandModel.findOne({ qrCode }).exec();

      if (!command) {
        throw new NotFoundException("The order is not found");
      }

      const companyId = command.companyId?.toString();

      if (role === "company" && userId && companyId !== userId) {
        throw new ForbiddenException(
          "You don't have permission to view this order"
        );
      }

      let companyData = null;
      if (companyId) {
        companyData = await this.userModel
          .findById(companyId)
          .select("_id phoneNumber field companyName")
          .exec();
      }

      const plainCommand = command.toObject();

      return {
        ...plainCommand,
        companyId: companyData
          ? {
              _id: companyData._id,
              phoneNumber: companyData.phoneNumber,
            }
          : null,
        companyField: companyData?.field || "مجال غير معروف",
        companyName: companyData?.companyName || "اسم غير معروف",
      };
    } catch (e) {
      console.log(e);
      if (e instanceof NotFoundException || e instanceof ForbiddenException) {
        throw e;
      }
      throw new BadRequestException("Try again");
    }
  }

  async confirmDeliveryByClient(orderId, clientInfo, updateStatusConfirmation) {
    console.log("Happy coding", orderId);
    try {
      let command = await this.commandModel.findById(orderId).exec();
      if (!command) {
        throw new NotFoundException("Command not found");
      }
      if (command.clientId.toString() !== clientInfo.id) {
        console.log("here are my id : ", command.clientId, clientInfo.id);
        throw new ForbiddenException(
          "You aren't allowed to update the status unless you are the client of this command"
        );
      }
      let confirmDelivery = await this.commandModel
        .findByIdAndUpdate(orderId, updateStatusConfirmation, {
          new: true,
          runValidators: true,
        })
        .exec();
      if (confirmDelivery) {
        return "Thank You for your feedback";
      }
    } catch (e) {
      if (e instanceof NotFoundException || e instanceof ForbiddenException) {
        throw e;
      }
      console.log("there's an error", e);
    }
  }

  async getStatistics() {
    try {
      let totalOrders = await this.commandModel.countDocuments();
      let today = new Date();
      let startOfDay = new Date(today.setUTCHours(0, 0, 0, 0));
      let endOfDay = new Date(today.setUTCHours(24, 0, 0, 0));
      let ordersOfDay = await this.commandModel
        .find({
          createdAt: { $gte: startOfDay, $lte: endOfDay },
        })
        .countDocuments();

      let monthlyOrders = await this.commandModel.aggregate([
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m", date: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]);

      let ordersPerCompany = await this.commandModel.aggregate([
        {
          $group: {
            _id: { companyId: "$companyId" },
            count: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "_id.companyId",
            foreignField: "_id",
            as: "company",
          },
        },
        {
          $unwind: "$company",
        },
        {
          $project: {
            _id: 0,
            companyId: "$_id.companyId",
            companyName: "$company.companyName",
            field: "$company.field",
            count: 1,
          },
        },
        {
          $sort: {
            companyId: 1,
          },
        },
      ]);
      let commandsByDay = await this.commandModel.aggregate([
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 },
        },
        {
          $project: {
            _id: 0,
            date: "$_id",
            commandCount: "$count",
          },
        },
      ]);
      let commandsBymonth = await this.commandModel.aggregate([
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m", date: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 },
        },
        {
          $project: {
            _id: 0,
            date: "$_id",
            commandCount: "$count",
          },
        },
      ]);

      let statistics = {
        "Total orders": totalOrders,
        "Total of orders made this day": ordersOfDay,
        "Total of orders made this month": monthlyOrders,
        "Total of orders per companyId": ordersPerCompany,
        "Total of orders of every single day": commandsByDay,
        "Total of orders of every single month": commandsBymonth,
      };
      return statistics;
    } catch (e) {
      console.log("there's an error here", e);
      throw new BadRequestException("Ops something went wrong");
    }
  }
}
