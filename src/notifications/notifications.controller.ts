import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  UseGuards,
} from "@nestjs/common";
import { NotificationsService } from "./notifications.service";
import { CreateNotificationDto } from "./dto/create-notification.dto";
import { UpdateNotificationDto } from "./dto/update-notification.dto";
import { validateJwt } from "../services/verifyJwt";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from "@nestjs/swagger";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { sendNotificationDto } from "./dto/send-notification.dto";
import { ResponseNotificationZwbSocket } from "./dto/response-websocket-notification.dto";
import { IsAuthenticated } from "../user/guards/is-authentificated.guard";

@Controller("notifications")
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @ApiOperation({
    summary: "Push notification to user through expo Push Notification",
  })
  @ApiBody({
    type: sendNotificationDto,
  })
  @ApiResponse({
    status: 500,
    description:
      "Sending Body without expo push Token : this error comes from Expo Push Notification Tool",
    schema: {
      example: {
        statusCode: 500,
        message: "Internal server error",
      },
    },
  })
  @ApiResponse({
    status: 200,
    description:
      "The notification was send successfully, The response comes from expo Push Notification Tool",
    schema: {
      example: {
        data: {
          status: "ok",
          id: "0196670b-aa78-7a90-9803-a5fe62ad1b0a",
        },
      },
    },
  })
  @ApiBearerAuth()
  @Post("/send")
  async sendNotification(
    @Body()
    body: {
      expoPushToken: string;
      title: string;
      message: string;
      data?: any;
    }
  ) {
    return await this.notificationsService.sendPushNotification(
      body.expoPushToken,
      body.title,
      body.message,
      body.data
    );
  }

  @ApiOperation({
    summary:
      "This method send a notification to user to inform them that they didn't take their command",
  })
  @ApiResponse({
    status: 500,
    description:
      "Sending Body without expo push Token : this error comes from Expo Push Notification Tool",
    schema: {
      example: {
        statusCode: 500,
        message: "Internal server error",
      },
    },
  })
  @ApiResponse({
    status: 201,
    description:
      "The notification was send successfully, The response comes from expo Push Notification Tool",
    schema: {
      example: {
        data: {
          status: "ok",
          id: "0196670b-aa78-7a90-9803-a5fe62ad1b0a",
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "Somthing crashed in the app",
    schema: {
      example: {
        statusCode: 400,
        message: "Ops Notification Not sent, something bad happend",
        error: "BadRequestExcepetion",
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: "The user is not authentificated",
    schema: {
      example: {
        message: "Try to login again",
        error: "Unauthorized",
        statusCode: 401,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description:
      "The user not found or the expo push notification of the user not found",
    content: {
      "application/json": {
        examples: {
          "The user not found": {
            value: {
              statusCode: 404,
              message: "the user not found",
              error: "Not Found Exception",
            },
          },
          "The expoPushToken of the user not found ": {
            value: {
              statusCode: 404,
              message: "Expo push notification of this user not found",
              error: "Not Found Exception",
            },
          },
        },
      },
    },
  })
  @ApiBearerAuth()
  @Post("reminder")
  @UseGuards(IsAuthenticated)
  async sendReminderNotification(@Req() req) {
    try {
      return await this.notificationsService.sendReminderNotification(req.user);
    } catch (e) {
      console.log("there's an error", e);
      if (e instanceof NotFoundException || e instanceof BadRequestException) {
        throw e;
      }
    }
  }

  @ApiOperation({ summary: "Create notification destinited to the reciever" })
  @ApiBearerAuth()
  @ApiBody({
    type: CreateNotificationDto,
  })
  @ApiResponse({
    status: 200,
    description:
      "the notification was created successfully, rather it's for broadcasting or notify a specific user",
    type: ResponseNotificationZwbSocket,
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized error: the user is not logged in ",
    schema: {
      example: {
        statusCode: 401,
        message: "Try to login again",
        error: "Unauthorized error",
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: "the reciever is not found",
    schema: {
      example: {
        statusCode: 404,
        message: "the reciever is not found",
        error: "Not Found error",
      },
    },
  })
  @ApiBearerAuth()
  @Post(":recevierId")
  createNotification(
    @Param("recevierId") recevierId: string,
    @Body() createNotificationDto: CreateNotificationDto,
    @Req() req
  ) {
    try {
      let token = req.headers["authorization"]?.split(" ")[1];
      let infoUser = validateJwt(token);
      if (!infoUser) {
        throw new UnauthorizedException("Try to login again");
      }
      return this.notificationsService.createNewNotification(
        recevierId,
        infoUser.id,
        createNotificationDto
      );
    } catch (e) {
      // console.log(e)
      if (e instanceof JsonWebTokenError || e instanceof TokenExpiredError)
        throw e;
      throw new BadRequestException("Try again");
    }
  }

  @ApiOperation({
    summary:
      "Notify a specific user about the changing in the status of his order",
  })
  @ApiBearerAuth()
  @Get(":orderId/:recieverId")
  notifyOrderCompleted(
    @Param("orderId") orderId: string,
    @Param("recieverId") receiverId: string,
    @Req() req
  ) {
    try {
      let token = req.headers.authorization;
      if (!token) {
        throw new UnauthorizedException("Try to login again");
      }
      let infoUser = validateJwt(token);
      if (!infoUser) {
        throw new UnauthorizedException("Try to login again");
      }
      return this.notificationsService.notificationCompleteOrder(
        orderId,
        infoUser,
        receiverId
      );
    } catch (e) {
      console.log(e);
      throw new BadRequestException("Ops smth went wrong");
    }
  }

  @Get()
  findAll() {
    return this.notificationsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.notificationsService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateNotificationDto: UpdateNotificationDto
  ) {
    return this.notificationsService.update(+id, updateNotificationDto);
  }
}
