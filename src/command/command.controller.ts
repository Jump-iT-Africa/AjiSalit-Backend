import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
  ForbiddenException,
  Put,
  ConflictException,
  UnprocessableEntityException,
  UseGuards,
  HttpException,
  UseInterceptors,
  UploadedFiles,
  ValidationPipe,
} from "@nestjs/common";
import { CommandService } from "./command.service";
import { CreateCommandDto } from "./dto/create-command.dto";
import { UpdateCommandDto } from "./dto/update-command.dto";
import { validateJwt } from "../services/verifyJwt";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
  ApiConsumes,
} from "@nestjs/swagger";
import ResponseDto from "./dto/response-command.dto";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { UpdateStatusCommandDto } from "./dto/update-status-command.dto";
import { UpdatepickUpDateCommandDto } from "./dto/update-pickup-date-command.dto";
import { responseStatusDTO } from "./dto/reponse-update-status-command.dto";
import { CompanyRoleGuard } from "../user/guards/company-role.guard";
import { IsAuthenticated } from "../user/guards/is-authentificated.guard";
import { ResponseCommandAndCompanyDTO } from "./dto/response-command-and-company.dto";
import { updateStatusConfirmationDto } from "./dto/update-confirmdelivery.dto";
import { ClientRoleGuard } from "../user/guards/client-role.guard";
import { AdminRoleGuard } from "../user/guards/admin-role.guard";
import { isatty } from "tty";
// import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { CommandInterceptor } from "./interceptors/command.interceptor";
import { Cron, CronExpression } from "@nestjs/schedule";
import { SanitizePipe } from "../common/pipes/sanitize.pipe";
import { FilesInterceptor } from "@nest-lab/fastify-multer";

@ApiTags("Orders ")
@Controller("order")
export class CommandController {
  constructor(private readonly commandService: CommandService) {}
  @ApiOperation({ summary: "Give the company the ability to add new order" })
  @ApiBearerAuth()
  @ApiConsumes("multipart/form-data")
  @ApiResponse({
    status: 201,
    description: "the response returns the details of the Order ",
    type: ResponseDto,
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
    status: 422,
    description: "Validation error: the provided order data is invalid ",
    content: {
      "application/json": {
        examples: {
          "Using advanced amount in paid or not paid cases": {
            value: {
              statusCode: 422,
              message:
                "Ops you have to choose the situation of partially paid to be able to add advanced amount",
              error: "Unprocessable Entity",
            },
          },
          "Invalid date": {
            value: {
              statusCode: 422,
              message:
                "The delivery Date is not valid, you can't deliver in the past",
              error: "Unprocessable Entity",
            },
          },
          "The Advanced amout is bigger than Price": {
            value: {
              statusCode: 422,
              message:
                "The advanced amount of The order suppose to be less than the total price",
              error: "Unprocessable Entity",
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: "Conflict error: the qrcode supposes to be unique",
    schema: {
      example: {
        statusCode: 409,
        message: "this QRCode is used",
        error: "Conflict error",
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "Bad Request: new exception",
    schema: {
      example: "Ops smth went wrong",
    },
  })
  @ApiResponse({
    status: 403,
    description:
      "Fobidden error: the user is not authorized to create and order due to his role",
    schema: {
      example: {
        statusCode: 403,
        message:
          "You aren't allowed to access this route unless you have a company role",
        error: "forbidden error",
      },
    },
  })
  @ApiResponse({
    status: 402,
    description:
      "Payment required error: No money left in the user's pocket, his balance is 0",
    schema: {
      example: {
        statusCode: 402,
        message: "Ops you are poor, your balance is zero",
      },
    },
  })
  @Post()
  @UseGuards(CompanyRoleGuard)
  @UseInterceptors(CommandInterceptor)
  @UseInterceptors(FilesInterceptor("images"))
  async create(
    @Body(new SanitizePipe(), new ValidationPipe({ whitelist: true }))
    createCommandDto: CreateCommandDto,
    @Req() req,
    @UploadedFiles() images
  ) {
    try {
      const ip = req.ip;
      console.log("creaaaaaaaaaaaaaaaaaaaaaaaaaaate ip", ip);
      return await this.commandService.create(
        createCommandDto,
        req.user.id,
        images
      );
    } catch (e) {
      console.log("ohhhhhh", e);
      if (
        e instanceof JsonWebTokenError ||
        e instanceof ForbiddenException ||
        e instanceof UnprocessableEntityException ||
        e instanceof ConflictException ||
        e instanceof HttpException ||
        e instanceof BadRequestException
      )
        throw e;
      throw new BadRequestException("Ops error in creating and here we go", e);
    }
  }

  @Patch(":qrcode")
  @ApiOperation({
    summary:
      "Once the code is scanned the ClientId should be added in database",
  })
  @ApiResponse({
    status: 200,
    description:
      "the qr code is scanned successfully and the clientid is updated",
    type: "Hgdthhhej00",
    example: "Congratulation the qrCode has been scanned successfully",
  })
  @ApiResponse({
    status: 403,
    description:
      "Fobidden error: the user supposes to had role and is not allowed to scan the qr code",
    schema: {
      example: {
        statusCode: 403,
        message: "You can't scan this qrCode unless you have the client role",
        error: "forbidden error",
      },
    },
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
    description: "Not found error: the order is not found",
    schema: {
      example: {
        statusCode: 404,
        message: "The order is not found",
        error: "Not found error",
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "Bad Request: new exception",
    schema: {
      example: "Ops smth went wrong",
    },
  })
  @ApiResponse({
    status: 409,
    description: "Conflict Exexeption: the qrCode is already scanned",
    schema: {
      example: "The qrCode is already scanned",
    },
  })
  @ApiBearerAuth()
  @UseGuards(IsAuthenticated)
  scanedUserId(@Param("qrcode") qrcode: string, @Req() req) {
    try {
      if (req.user.role !== "client" && req.user.role !== "admin") {
        throw new ForbiddenException(
          "You can't scan this qrCode unless you have the client role"
        );
      }
      return this.commandService.scanedUserId(
        qrcode,
        req.user.id,
        req.user.username
      );
    } catch (e) {
      if (
        e instanceof JsonWebTokenError ||
        e instanceof TokenExpiredError ||
        e instanceof UnauthorizedException ||
        e instanceof ConflictException ||
        e instanceof ForbiddenException
      )
        throw e;
      throw new BadRequestException("ops smth went wrong");
    }
  }

  @Get()
  @ApiOperation({
    summary:
      "The client or the company can check their orders, and the admin can view all the orders",
  })
  @ApiBearerAuth()
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
    status: 400,
    description: "Bad Request: new exception",
    schema: {
      example: "Try again",
    },
  })
  @ApiResponse({
    status: 200,
    description: "The client or the company could see their own orders",
    content: {
      "application/json": {
        examples: {
          "Fetching orders 'an order that has been scanned by user' and 'order that has null clientId'":
            {
              value: [
                {
                  _id: "6821d68bed9b91a5b2bc176d",
                  companyId: "6821c62d479cfdf849cf5d24",
                  clientId: null,
                  situation: "prepayment",
                  status: "finished",
                  isExpired: false,
                  advancedAmount: 200,
                  price: 8000,
                  images: ["image1.jpg", "image2.jpg"],
                  deliveryDate: "2025-10-26T00:00:00.000Z",
                  pickupDate: "2025-10-28T00:00:00.000Z",
                  qrCode: "WEEEEEEE",
                  isFinished: false,
                  isPickUp: false,
                  isDateChanged: true,
                  IsConfirmedByClient: false,
                  ChangeDateReason: "sick",
                  newDate: "2025-10-30T00:00:00.000Z",
                  createdAt: "2025-05-12T11:07:55.605Z",
                  updatedAt: "2025-05-12T11:07:55.605Z",
                  __v: 0,
                },
                {
                  _id: "6821d6a2ed9b91a5b2bc1772",
                  companyId: "6821c62d479cfdf849cf5d24",
                  clientId: {
                    _id: "681cdcbcfa4691bf1d997e99",
                    Fname: "Salima ",
                    Lname: "Bouhamidi",
                    phoneNumber: "+212698878964",
                  },
                  situation: "prepayment",
                  status: "finished",
                  isExpired: false,
                  advancedAmount: 200,
                  price: 22000,
                  images: ["image1.jpg", "image2.jpg"],
                  deliveryDate: "2025-10-26T00:00:00.000Z",
                  pickupDate: "2025-10-28T00:00:00.000Z",
                  qrCode: "TOKYOO",
                  isFinished: false,
                  isPickUp: false,
                  isDateChanged: true,
                  IsConfirmedByClient: false,
                  ChangeDateReason: "sick",
                  newDate: "2025-10-30T00:00:00.000Z",
                  createdAt: "2025-05-12T11:08:18.738Z",
                  updatedAt: "2025-05-12T11:08:18.738Z",
                  __v: 0,
                },
              ],
            },
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: "Not Found: There's no order yet",
    schema: {
      example: {
        statusCode: 404,
        message: "No orders found",
        error: "Not Found error",
      },
    },
  })
  @UseGuards(IsAuthenticated)
  async findAll(@Req() req) {
    try {
      return await this.commandService.findAll(req.user.id, req.user.role);
    } catch (e) {
      console.log(e);
      if (
        e instanceof NotFoundException ||
        e instanceof JsonWebTokenError ||
        e instanceof TokenExpiredError ||
        e instanceof UnauthorizedException
      ) {
        throw e;
      }
      throw new BadRequestException("Try again");
    }
  }

  @ApiOperation({
    summary:
      "Only admins can access: get statistics of orders (total, daily, monthly, per company)",
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: "Statistics retrieved successfully",
    content: {
      "application/json": {
        examples: {
          success: {
            value: {
              "Total orders": 6,
              "Total of orders made this day": 4,
              "Total of orders made this month": [
                {
                  _id: null,
                  count: 2,
                },
                {
                  _id: "2025-05",
                  count: 4,
                },
              ],
              "Total of orders per companyId": [
                {
                  count: 2,
                  companyId: "681a4ac152cf9d2684cc562c",
                  companyName: "Suushejw",
                  field: "غسيل السيارات",
                },
                {
                  count: 4,
                  companyId: "681b604799836f72f332ceb9",
                  companyName: "deals",
                  field: null,
                },
              ],
              "Total of orders of every single day": [
                {
                  date: "2024-05-13",
                  commandCount: 1,
                },
                {
                  date: "2025-04-14",
                  commandCount: 1,
                },
                {
                  date: "2025-05-13",
                  commandCount: 21,
                },
                {
                  date: "2025-05-14",
                  commandCount: 3,
                },
              ],
              "Total of orders of every single month": [
                {
                  date: "2024-05",
                  commandCount: 1,
                },
                {
                  date: "2025-04",
                  commandCount: 1,
                },
                {
                  date: "2025-05",
                  commandCount: 24,
                },
              ],
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "Bad Request: Something went wrong",
    content: {
      "application/json": {
        examples: {
          "Something breaks": {
            value: {
              message: "Ops something went wrong",
              error: "Bad Request",
              statusCode: 400,
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized: User is not authenticated",
    schema: {
      example: {
        statusCode: 401,
        message: "kindly try to login again",
        error: "Unauthorized",
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden: User is not an admin",
    schema: {
      example: {
        statusCode: 403,
        message: "Ops only admins can access to this route",
        error: "Forbidden",
      },
    },
  })
  @Get("statistics")
  @UseGuards(AdminRoleGuard)
  async statistics() {
    try {
      return await this.commandService.getStatistics();
    } catch (e) {
      if (
        e instanceof UnauthorizedException ||
        e instanceof ForbiddenException ||
        e instanceof UnauthorizedException ||
        e instanceof JsonWebTokenError ||
        e instanceof BadRequestException
      ) {
        throw e;
      }
    }
  }

  @Get(":id")
  @ApiOperation({
    summary:
      "The client or the company can see th details of their sepefic order and the name and field of company",
  })
  @ApiResponse({
    status: 200,
    description:
      "The client or the company check the details of order successfully",
    type: ResponseCommandAndCompanyDTO,
  })
  @ApiResponse({
    status: 400,
    description: "Bad Request: new exception",
    content: {
      "application/json": {
        examples: {
          "The id of an order is not valid mongodbId": {
            value: {
              message: "The order Is is not valid, try with a valid order Id",
              error: "Bad Request",
              statusCode: 400,
            },
          },
          "Something happend that can crash the app": {
            value: "Try again",
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: "Not found exception: the order is not found",
    schema: {
      example: {
        message: "No order found",
        error: "Not Found",
        statusCode: 404,
      },
    },
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
  @ApiBearerAuth()
  @UseGuards(IsAuthenticated)
  async findOne(@Param("id") id: string, @Req() req) {
    try {
      return await this.commandService.findOne(id, req.user);
    } catch (e) {
      if (e instanceof JsonWebTokenError || e instanceof TokenExpiredError)
        throw new UnauthorizedException("Try to login again");
      throw new BadRequestException("Try again");
    }
  }

  @Put(":id")
  @UseGuards(CompanyRoleGuard)
  @ApiOperation({ summary: "The company owner can update his own order" })
  @ApiBody({
    type: ResponseDto,
  })
  @ApiResponse({
    status: 200,
    description: "The company owner can update the order successfully",
    type: ResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Bad Request: new exception",
    content: {
      "application/json": {
        examples: {
          "The id of an order is not valid mongodbId": {
            value: {
              message: "The order Is is not valid, try with a valid order Id",
              error: "Bad Request",
              statusCode: 400,
            },
          },
          "Something happend that can crash the app": {
            value: "Try again",
          },
        },
      },
    },
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
    status: 403,
    description:
      "Fobidden error: Only the company owner that has an order can update it",
    schema: {
      example: {
        statusCode: 403,
        message:
          "You aren't allowed to access this route unless you have a company role",
        error: "forbidden error",
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: "Not found exception: the order not found",
    schema: {
      example: {
        message: "Order Not found",
        error: "Not Found",
        statusCode: 404,
      },
    },
  })
  @ApiBearerAuth()
  async update(
    @Param("id") id: string,
    @Body(new SanitizePipe(), new ValidationPipe({ whitelist: true }))
    updateCommandDto: UpdateCommandDto,
    @Req() req
  ) {
    try {
      return await this.commandService.update(
        req.user.id,
        id,
        updateCommandDto
      );
    } catch (e) {
      console.log(e);
      if (
        e instanceof JsonWebTokenError ||
        e instanceof TokenExpiredError ||
        e instanceof ForbiddenException ||
        e instanceof BadRequestException
      )
        throw e;
      throw new BadRequestException("Try again");
    }
  }

  @Delete(":id")
  @UseGuards(CompanyRoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "The company order can delete an order" })
  @ApiResponse({
    status: 200,
    description: "The company owner deletes the order successfully",
    example: {
      message: "The order was deleted successfully",
    },
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
    status: 403,
    description:
      "Fobidden error: Only the company owner that has an order can delete it",
    schema: {
      example: {
        statusCode: 403,
        message:
          "You aren't allowed to access this route unless you have a company role",
        error: "forbidden error",
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: "Not found exception: the order not found",
    schema: {
      example: {
        message: "Order Not found",
        error: "Not Found",
        statusCode: 404,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "Bad Request: new exception",
    content: {
      "application/json": {
        examples: {
          "The id of an order is not valid mongodbId": {
            value: {
              message: "The order Is is not valid, try with a valid order Id",
              error: "Bad Request",
              statusCode: 400,
            },
          },
          "Something happend that can crash the app": {
            value: "Try again",
          },
        },
      },
    },
  })
  async remove(@Param("id") id: string, @Req() req) {
    try {
      return await this.commandService.deleteOrder(id, req.user.id);
    } catch (e) {
      console.log(e);
      if (
        e instanceof JsonWebTokenError ||
        e instanceof TokenExpiredError ||
        e instanceof ForbiddenException ||
        e instanceof UnauthorizedException ||
        e instanceof NotFoundException
      )
        throw e;

      throw new BadRequestException("Try again");
    }
  }

  @Get("scan/:qrCode")
  @ApiOperation({ summary: "Scan QR code and retrieve command details" })
  @ApiParam({
    name: "qrCode",
    description: "The unique QR code string from the scanned code",
  })
  @ApiResponse({
    status: 200,
    description: "Command details retrieved successfully",
  })
  @ApiResponse({
    status: 404,
    description: "Command not found",
    schema: {
      example: {
        message: "The order is not found",
        error: "Not Found",
        statusCode: 404,
      },
    },
  })
  @ApiBearerAuth()
  async scanQrCode(@Param("qrCode") qrCode: string, @Req() req) {
    try {
      let token = req.headers["authorization"]?.split(" ")[1];
      let infoUser = validateJwt(token);

      if (!infoUser) {
        throw new UnauthorizedException("Try to login again");
      }
      return this.commandService.getCommandByQrCode(
        qrCode,
        infoUser.id,
        infoUser.role
      );
    } catch (e) {
      console.log(e);
      if (e instanceof JsonWebTokenError || e instanceof TokenExpiredError)
        throw new UnauthorizedException("Try to login again");
      if (e instanceof ForbiddenException) {
        throw new ForbiddenException("You are not allowed to update this oder");
      }
      throw new BadRequestException("Try again");
    }
  }

  @ApiOperation({
    summary:
      "The company owner can change his order's status to Done and the client will get a notification related to this",
  })
  @ApiBody({
    type: UpdateStatusCommandDto,
  })
  @ApiResponse({
    status: 200,
    description: "The company change the status successfully",
    type: responseStatusDTO,
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
    description: "Not found exception: the order not found",
    schema: {
      example: {
        message: "The command not found",
        error: "Not Found",
        statusCode: 404,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "Bad Request: new exception",
    content: {
      "application/json": {
        examples: {
          "Wrong status": {
            value: {
              message: [
                "status must be one of the following values: ",
                "The status must be one of the following: inProgress, finished, delivered",
              ],
              error: "Bad Request",
              statusCode: 400,
            },
          },
          "Something happend that can crash the app": {
            value: "Ops Something went wrong",
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description:
      "Fobidden error: The user should be the owner of this order to update it",
    content: {
      "application/json": {
        examples: {
          "You don't have the role of company": {
            value: {
              message:
                "You aren't allowed to access this route unless you have a company role",
              error: "Forbidden",
              statusCode: 403,
            },
          },
          "You are trying to update an order that's not yours ": {
            value: {
              statusCode: 403,
              message: "You are not allowed to update this oder",
              error: "forbidden error",
            },
          },
        },
      },
    },
  })
  @ApiBearerAuth()
  @Patch("status/:orderId")
  @UseGuards(CompanyRoleGuard)
  async updateStatusToDone(
    @Param("orderId") orderId: string,
    @Body(new SanitizePipe(), new ValidationPipe({ whitelist: true }))
    updatestatusDTo: UpdateStatusCommandDto,
    @Req() req
  ) {
    try {
      return await this.commandService.updateOrderToDoneStatus(
        req.user.id,
        orderId,
        updatestatusDTo
      );
    } catch (e) {
      console.log("there's a problem oooo", e);
      if (
        e instanceof NotFoundException ||
        e instanceof ForbiddenException ||
        e instanceof UnauthorizedException
      ) {
        throw e;
      }
      throw new BadRequestException("Ops Something went wrong", e);
    }
  }

  @ApiOperation({
    summary:
      "The company owner can change his order's pickup date and once he done so the user will get a notification related to this",
  })
  @ApiBody({
    type: UpdatepickUpDateCommandDto,
  })
  @ApiResponse({
    status: 200,
    description: "The company change the pick up date successfully",
    type: UpdatepickUpDateCommandDto,
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
    description: "Not found exception: the order not found",
    schema: {
      example: {
        message: "Ops this command not found",
        error: "Not Found",
        statusCode: 404,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "Bad Request: new exception",
    content: {
      "application/json": {
        examples: {
          "Wrong status": {
            value: {
              message: [
                "The date must be in the format YYYY-MM-DD",
                "The date has be not empty and to  be on this format: YYYY-MM-DD",
              ],
              error: "Bad Request",
              statusCode: 400,
            },
          },
          "Something happend that can crash the app": {
            value: "Ops Something went wrong",
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description:
      "Fobidden error: The user should be the owner of this order to update it",
    content: {
      "application/json": {
        examples: {
          "You don't have the role of company": {
            value: {
              message:
                "You aren't allowed to access this route unless you have a company role",
              error: "Forbidden",
              statusCode: 403,
            },
          },
          "You are trying to update an order that's not yours ": {
            value: {
              statusCode: 403,
              message: "You are not allowed to update this oder",
              error: "forbidden error",
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 422,
    description: "The pickupdate is not valid, it shouldn't be in the past",
    schema: {
      example: {
        statusCode: 422,
        message:
          "The pickup Date is not valid, Please pick up another Date rather it's today or in the future",
        error: "Unprocessable Entity",
      },
    },
  })
  @ApiBearerAuth()
  @Patch("pickup/:orderId")
  @UseGuards(CompanyRoleGuard)
  async updatepickUpDate(
    @Param("orderId") orderId: string,
    @Body(new SanitizePipe(), new ValidationPipe({ whitelist: true }))
    updatepickUpDateDTo: UpdatepickUpDateCommandDto,
    @Req() req
  ) {
    try {
      return await this.commandService.updateOrderpickUpDate(
        req.user.id,
        orderId,
        updatepickUpDateDTo
      );
    } catch (e) {
      console.log("there's a problem oooo", e);
      if (
        e instanceof NotFoundException ||
        e instanceof ForbiddenException ||
        e instanceof BadRequestException ||
        e instanceof UnprocessableEntityException ||
        e instanceof UnauthorizedException
      ) {
        throw e;
      }
      throw new BadRequestException("Ops Something went wrong");
    }
  }

  @ApiOperation({
    summary: "Allows a client to confirm the delivery of their own order",
  })
  @ApiBody({
    type: updateStatusConfirmationDto,
  })
  @ApiResponse({
    status: 200,
    description: "Client successfully confirmed the delivery",
    schema: {
      example: "Thank You for your feedback",
    },
  })
  @ApiResponse({
    status: 401,
    description:
      "Unauthorized error: The user is not logged in or the token is invalid",
    schema: {
      example: {
        statusCode: 401,
        message: "kindly try to login again",
        error: "Unauthorized",
      },
    },
  })
  @ApiResponse({
    status: 403,
    description:
      "Forbidden error: The user is not allowed to confirm that he recieve his offer",
    content: {
      "application/json": {
        examples: {
          "Invalid Role": {
            value: {
              statusCode: 403,
              message: "Ops only clients can access to this route",
              error: "Forbidden",
            },
          },
          "The client don't have relationship with this command": {
            value: {
              statusCode: 403,
              message:
                "You aren't allowed to update the status unless you are the client of this command",
              error: "Forbidden",
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: "Not found error: The order does not exist",
    schema: {
      example: {
        statusCode: 404,
        message: "Command not found",
        error: "Not Found",
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "Bad Request: A general error occurred",
    content: {
      "application/json": {
        examples: {
          "Validation Error": {
            value: {
              message: ["it has to be boolean either true or false"],
              error: "Bad Request",
              statusCode: 400,
            },
          },
          "Unexpected Error": {
            value: "Ops Something went wrong",
          },
        },
      },
    },
  })
  @ApiBearerAuth()
  @Patch("confirmdelivery/:orderId")
  @UseGuards(ClientRoleGuard)
  async confirmDeliveryByClient(
    @Param("orderId") orderId: string,
    @Body(new SanitizePipe(), new ValidationPipe({ whitelist: true }))
    updateStatusConfirmation: updateStatusConfirmationDto,
    @Req() req
  ) {
    try {
      return await this.commandService.confirmDeliveryByClient(
        orderId,
        req.user,
        updateStatusConfirmation
      );
    } catch (e) {
      console.log("there's a problem oooo", e);
      if (
        e instanceof NotFoundException ||
        e instanceof ForbiddenException ||
        e instanceof BadRequestException ||
        e instanceof UnprocessableEntityException ||
        e instanceof UnauthorizedException
      ) {
        throw e;
      }
      throw new BadRequestException("Ops Something went wrong");
    }
  }

  @ApiOperation({
    summary:
      "The reminder Notification sent to the client to after the order is done to get his order",
  })
  @Cron(CronExpression.EVERY_DAY_AT_3PM)
  async clientReminderNorification() {
    try {
      return await this.commandService.commandClientReminder();
    } catch (e) {
      throw e;
    }
  }

  @ApiOperation({
    summary:
      "The reminder Notification sent to the company in case the company does not deliver after the deadline",
  })
  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async companyReminderNotification() {
    try {
      return await this.commandService.commandCompanyReminder();
    } catch (e) {
      throw e;
    }
  }
}
