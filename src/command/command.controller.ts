import { Controller, Get, Post, Body, Patch, Param, Delete, Req, BadRequestException, NotFoundException, UnauthorizedException, ForbiddenException, Put, ConflictException, UnprocessableEntityException } from '@nestjs/common';
import { CommandService } from './command.service';
import { CreateCommandDto } from './dto/create-command.dto';
import { UpdateCommandDto } from './dto/update-command.dto';
import { validateJwt } from "../services/verifyJwt"
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import ResponseDto from "./dto/response-command.dto"
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { UpdateStatusCommandDto } from './dto/update-status-command.dto';
import { UpdatepickUpDateCommandDto } from './dto/update-pickup-date-command.dto';
import { responseStatusDTO } from './dto/reponse-update-status-command.dto';

@ApiTags('Orders ')
@Controller('order')
export class CommandController {
  constructor(private readonly commandService: CommandService) { }
  @Post()
  @ApiOperation({ summary: "Give the company the ability to add new order" })
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: 'the response returns the details of the Order ',
    type: ResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized error: the user is not logged in ',
    schema: {
      example: {
        statusCode: 401,
        message: "Try to login again",
        error: 'Unauthorized error',
      },
    },
  })
  @ApiResponse({
    status: 422,
    description: 'Validation error: the provided order data is invalid ',
    content: {
      'application/json': {
        examples: {
          "Using advanced amount in paid or not paid cases": {
            value: {
              statusCode: 422,
              message: "Ops you have to choose the situation of partially paid to be able to add advanced amount",
              error: 'Unprocessable Entity',
            }
          },
          "Invalid date": {
            value: {
              statusCode: 422,
              message: "The delivery Date is not valid, you can't deliver in the past",
              error: 'Unprocessable Entity',
            }
          },
          "The Advanced amout is bigger than Price": {
            value: {
              statusCode: 422,
              message: "The advanced amount of The order suppose to be less than the total price",
              error: 'Unprocessable Entity',
            }
          },
        },
      },
    }
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict error: the qrcode supposes to be unique',
    schema: {
      example: {
        statusCode: 409,
        message: "this QRCode is used",
        error: 'Conflict error',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request: new exception',
    schema: {
      example: "Ops smth went wrong"

    },
  })
  @ApiResponse({
    status: 403,
    description: 'Fobidden error: the user is not authorized to create and order due to his role',
    schema: {
      example: {
        statusCode: 403,
        message: "you are not allowed to add an Order, you have to have company role to do so",
        error: 'forbidden error',
      },
    },
  })

  create(@Body() createCommandDto: CreateCommandDto, @Req() req) {
    try {
      let token = req.headers['authorization']?.split(" ")[1];
      let infoUser = validateJwt(token);
      console.log(infoUser.role);
      if (!infoUser) {
        throw new UnauthorizedException("Try to login again")
      }

      if (infoUser.role !== "company") {
        throw new ForbiddenException("you are not allowed to add an Order, you have to have company role to do so")
      }
      const authentificatedId = infoUser.id;
      return this.commandService.create(createCommandDto, authentificatedId);

    } catch (e) {
      if (e instanceof JsonWebTokenError)
        throw new UnauthorizedException("Try to login again")
      if (e instanceof ForbiddenException) {
        throw new ForbiddenException("you are not allowed to add an Order, you have to have company role to do so")
      }
      throw new BadRequestException('Ops smth went wrong', e)
    }
  }

  @Patch(':qrcode')
  @ApiOperation({ summary: "Once the code is scanned the ClientId should be added in database" })
  @ApiResponse({
    status: 200,
    description: "the qr code is scanned successfully and the clientid is updated",
    type: "Hgdthhhej00",
    example: "Congratulation the qrCode has been scanned successfully"
  })
  @ApiResponse({
    status: 403,
    description: 'Fobidden error: the user has company role and is not allowed to scan the qr code',
    schema: {
      example: {
        statusCode: 403,
        message: "You can't scan this qrCode unless you have the client role",
        error: 'forbidden error',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized error: the user is not logged in ',
    schema: {
      example: {
        statusCode: 401,
        message: "Try to login again",
        error: 'Unauthorized error',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Not found error: the order is not found',
    schema: {
      example: {
        statusCode: 404,
        message: "The order is not found",
        error: 'Not found error'
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request: new exception',
    schema: {
      example: "Ops smth went wrong",
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict Exexeption: the qrCode is already scanned',
    schema: {
      example: "The qrCode is already scanned",
    },
  })

  @ApiBearerAuth()
  scanedUserId(@Param('qrcode') qrcode: string, @Req() req) {
    try {
      let token = req.headers['authorization']?.split(" ")[1];
      let infoUser = validateJwt(token);
      if (!infoUser || !token) {
        throw new UnauthorizedException("Try to login again")
      }
      if (infoUser.role !== "client" && infoUser.role !== "admin") {
        throw new ForbiddenException("You can't scan this qrCode unless you have the client role")
      }
      return this.commandService.scanedUserId(qrcode, infoUser.id, infoUser.username);

    } catch (e) {
      if (e instanceof ForbiddenException ) {
        throw new ForbiddenException("You can't scan this qrCode unless you have the client role")
      }
      if (e instanceof JsonWebTokenError || e instanceof TokenExpiredError)
        throw new UnauthorizedException("Try to login again")
      if (e instanceof UnauthorizedException) {
        throw new UnauthorizedException("Try to login again")
      }
      if (e instanceof ConflictException) {
        throw new ConflictException("The qrCode is already scanned")
      }
      throw new BadRequestException("ops smth went wrong")
    }
  }


  @Get()
  @ApiOperation({ summary: "The client or the company can check their orders" })
  @ApiBearerAuth()
  @ApiResponse({
    status: 401,
    description: 'Unauthorized error: the user is not logged in ',
    schema: {
      example: {
        statusCode: 401,
        message: "Try to login again",
        error: 'Unauthorized error',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request: new exception',
    schema: {
      example: "Try again",
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The client or the company could see their own orders',
    content: {
      'application/json': {
        examples: {
          "There's some orders": {
            value: [
              {
                "pickupDate": null,
                "_id": "67c0091e832153d893519185",
                "companyId": "67bca1a1b3c6a150efad2045",
                "clientId": "67c000469ab780a55e027c96",
                "situation": "تسبيق",
                "status": "قيد الانتظار",
                "advancedAmount": 2000,
                "price": 50000,
                "images": [],
                "deliveryDate": "2025-10-26T00:00:00.000Z",
                "qrCodeUrl": "Hgdthej8900",
                "__v": 0
              },
              {
                "_id": "67c06fe41468ebe553a31fe5",
                "companyId": "67bca1a1b3c6a150efad2045",
                "clientId": "67c000469ab780a55e027c96",
                "situation": "تسبيق",
                "status": "قيد الانتظار",
                "advancedAmount": 2000,
                "price": 70000,
                "images": [],
                "deliveryDate": "2025-10-29T00:00:00.000Z",
                "pickupDate": null,
                "qrCode": "Hgdthhhej00",
                "__v": 0
              }
            ]
          },
          "there's no order": {
            value: "No order found",
          },

        },
      },
    }
  })
  findAll(@Req() req) {
    try {
      let token = req.headers['authorization']?.split(" ")[1];
      
      let infoUser = validateJwt(token);
      // console.log(infoUser)
      if (!infoUser || !token) {
        throw new UnauthorizedException("Try to login again")
      }
      return this.commandService.findAll(infoUser.id, infoUser.role);
    } catch (e) {
      console.log(e);
      if (e instanceof JsonWebTokenError || e instanceof TokenExpiredError)
        throw new UnauthorizedException("Try to login again")
      if(e instanceof UnauthorizedException){
        throw new UnauthorizedException("Try to login again")

      }
      throw new BadRequestException("Try again")
    }

  }

  @Get(':id')
  @ApiOperation({ summary: "The client or the company can see th details of their sepefic order" })
  @ApiResponse({
    status: 200,
    description: 'The client or the company check the details of order successfully',
    type: ResponseDto
  })

  @ApiResponse({
    status: 400,
    description: 'Bad Request: new exception',
    content: {
      'application/json': {
        examples: {
          "The id of an order is not valid mongodbId": {
            value: {
              "message": "The order Is is not valid, try with a valid order Id",
              "error": "Bad Request",
              "statusCode": 400
            },

          },
          "Something happend that can crash the app": {
            value: "Try again"
          },
        },
      },
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Not found exception: the order is not found',
    schema: {
      example: {
        "message": "No order found",
        "error": "Not Found",
        "statusCode": 404
      }
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized error: the user is not logged in ',
    schema: {
      example: {
        statusCode: 401,
        message: "Try to login again",
        error: 'Unauthorized error',
      },
    },
  })
  @ApiBearerAuth()

  findOne(@Param('id') id: string, @Req() req) {
    try {
      let token = req.headers['authorization']?.split(" ")[1];
      let infoUser = validateJwt(token);
      console.log(infoUser)
      if (!infoUser){
        throw new UnauthorizedException("Try to login again")
      }
      return this.commandService.findOne(id, infoUser);
    } catch (e) {
      if (e instanceof JsonWebTokenError || e instanceof TokenExpiredError)
        throw new UnauthorizedException("Try to login again")
      throw new BadRequestException("Try again")
    }
  }



  @Put(':id')
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
    description: 'Bad Request: new exception',
    content: {
      'application/json': {
        examples: {
          "The id of an order is not valid mongodbId": {
            value: {
              "message": "The order Is is not valid, try with a valid order Id",
              "error": "Bad Request",
              "statusCode": 400
            },

          },
          "Something happend that can crash the app": {
            value: "Try again"
          },
        },
      },
    }
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized error: the user is not logged in ',
    schema: {
      example: {
        statusCode: 401,
        message: "Try to login again",
        error: 'Unauthorized error',
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Fobidden error: Only the company owner that has an order can update it',
    schema: {
      example: {
        statusCode: 403,
        message: "You are not allowed to update this oder",
        error: 'forbidden error',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Not found exception: the order not found',
    schema: {
      example: {
        "message": "Order Not found",
        "error": "Not Found",
        "statusCode": 404
      }
    },
  })
  @ApiBearerAuth()

  update(@Param('id') id: string, @Body() updateCommandDto: UpdateCommandDto, @Req() req) {
    try {
      let token = req.headers['authorization']?.split(" ")[1];
      let infoUser = validateJwt(token);
      if (!infoUser) {
        throw new UnauthorizedException("Try to login again")
      }
      if (infoUser.role !== "company") {
        throw new ForbiddenException("You are not allowed to update this oder")
      }
      return this.commandService.update(infoUser.id, id, updateCommandDto);

    } catch (e) {
      console.log(e)
      if (e instanceof JsonWebTokenError || e instanceof TokenExpiredError)
        throw new UnauthorizedException("Try to login again")
      if (e instanceof ForbiddenException) {
        throw new ForbiddenException("You are not allowed to update this oder")
      }
      throw new BadRequestException("Try again")
    }

  }

  @Delete(':id')
  @ApiBearerAuth()

  @ApiOperation({ summary: "The company order want to delete an order" })
  @ApiResponse({
    status: 200,
    description: "The company owner deletes the order successfully",
    example: "The order was deleted successfully"
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized error: the user is not logged in ',
    schema: {
      example: {
        statusCode: 401,
        message: "Try to login again",
        error: 'Unauthorized error',
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Fobidden error: Only the company owner that has an order can delete it',
    schema: {
      example: {
        statusCode: 403,
        message: "You can't delete this order",
        error: 'forbidden error',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Not found exception: the order not found',
    schema: {
      example: {
        "message": "Order Not found",
        "error": "Not Found",
        "statusCode": 404
      }
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request: new exception',
    content: {
      'application/json': {
        examples: {
          "The id of an order is not valid mongodbId": {
            value: {
              "message": "The order Is is not valid, try with a valid order Id",
              "error": "Bad Request",
              "statusCode": 400
            },

          },
          "Something happend that can crash the app": {
            value: "Try again"
          },
        },
      },
    }
  })
  @ApiBearerAuth()

  remove(@Param('id') id: string, @Req() req) {
    try {
      let token = req.headers['authorization']?.split(" ")[1]
      let infoUser = validateJwt(token);
      if (!infoUser) {
        throw new UnauthorizedException("Try to login again")
      }
      if (infoUser.role !== "company") {
        throw new ForbiddenException("You can't delete this order")
      }
      return this.commandService.deleteOrder(id, infoUser.id);
    } catch (e) {
      console.log(e);
      if (e instanceof JsonWebTokenError || e instanceof TokenExpiredError)
        throw new UnauthorizedException("Try to login again")
      if (e instanceof ForbiddenException) {
        throw new ForbiddenException("You are not allowed to update this oder")
      }
      throw new BadRequestException("Try again")
    }
  }



  @Get('scan/:qrCode')
  @ApiOperation({ summary: 'Scan QR code and retrieve command details' })
  @ApiParam({ name: 'qrCode', description: 'The unique QR code string from the scanned code' })
  @ApiResponse({
    status: 200,
    description: 'Command details retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Command not found',
    schema: {
      example: {
        message: "The order is not found",
        error: 'Not Found',
        statusCode: 404
      }
    }
  })
  @ApiBearerAuth()
  async scanQrCode(@Param('qrCode') qrCode: string, @Req() req) {
    try {

      let token = req.headers['authorization']?.split(" ")[1]
      let infoUser = validateJwt(token);


      if (!infoUser) {
        throw new UnauthorizedException("Try to login again")
      }

      return this.commandService.getCommandByQrCode(qrCode);
    }
    catch (e) {
      console.log(e);
      if (e instanceof JsonWebTokenError || e instanceof TokenExpiredError)
        throw new UnauthorizedException("Try to login again")
      if (e instanceof ForbiddenException) {
        throw new ForbiddenException("You are not allowed to update this oder")
      }
      throw new BadRequestException("Try again")
    }
  }

  @ApiOperation({ summary: "The company owner can change his order's status to Done and the client will get a notification related to this" })
  @ApiBody({
    type: UpdateStatusCommandDto,
  })
  @ApiResponse({
    status: 200,
    description: 'The company change the status successfully',
    type: responseStatusDTO,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized error: the user is not logged in ',
    schema: {
      example: {
        statusCode: 401,
        message: "Try to login again",
        error: 'Unauthorized error',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Not found exception: the order not found',
    schema: {
      example: {
        "message": "Ops this command not found",
        "error": "Not Found",
        "statusCode": 404
      }
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request: new exception',
    content: {
      'application/json': {
        examples: {
          "Wrong status": {
            value: {
              "message": [
                "status must be one of the following values: ",
                "The status must be one of the following: في طور الانجاز, جاهزة للتسليم, تم تسليم"
            ],
              "error": "Bad Request",
              "statusCode": 400
            },

          },
          "Something happend that can crash the app": {
            value: "Ops Something went wrong"
          },
        },
      },
    }
  })
  @ApiResponse({
    status: 403,
    description: 'Fobidden error: The user should be the owner of this order to update it',
    schema: {
      example: {
        statusCode: 403,
        message: "You are not allowed to update this oder",
        error: 'forbidden error',
      },
    },
  })
  @ApiBearerAuth()



  
  @Patch("status/:orderId")
  async updateStatusToDone(@Param("orderId") orderId: string, @Body() updatestatusDTo: UpdateStatusCommandDto, @Req() req) {
    try {
      let token = req.headers['authorization']?.split(" ")[1]
      let infoUser = validateJwt(token);

      if (!infoUser) {
        throw new UnauthorizedException("Try to login again")
      }
      let result = await this.commandService.updateOrderToDoneStatus(infoUser.id, orderId, updatestatusDTo)
      if(!result){
        throw new NotFoundException("Ops this command not found")
      }
      return result
    } catch (e) {
      console.log("there's a problem oooo", e)
      if( e instanceof NotFoundException || e instanceof ForbiddenException || e instanceof UnauthorizedException){
        throw e
      }
      throw new BadRequestException("Ops Something went wrong", e)
    }
  }


  @ApiOperation({ summary: "The company owner can change his order's pickup date and once he done so the user will get a notification related to this" })
  @ApiBody({
    type: UpdatepickUpDateCommandDto,
  })
  @ApiResponse({
    status: 200,
    description: 'The company change the pick up date successfully',
    type: UpdatepickUpDateCommandDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized error: the user is not logged in ',
    schema: {
      example: {
        statusCode: 401,
        message: "Try to login again",
        error: 'Unauthorized error',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Not found exception: the order not found',
    schema: {
      example: {
        "message": "Ops this command not found",
        "error": "Not Found",
        "statusCode": 404
      }
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request: new exception',
    content: {
      'application/json': {
        examples: {
          "Wrong status": {
            value: {
              "message": [
                "The date must be in the format YYYY-MM-DD",
                "The date has be not empty and to  be on this format: YYYY-MM-DD"
            ],
              "error": "Bad Request",
              "statusCode": 400
            },

          },
          "Something happend that can crash the app": {
            value: "Ops Something went wrong"
          },
        },
      },
    }
  })
  @ApiResponse({
    status: 403,
    description: 'Fobidden error: The user should be the owner of this order to update it',
    schema: {
      example: {
        statusCode: 403,
        message: "You are not allowed to update this oder",
        error: 'forbidden error',
      },
    },
  })
  @ApiResponse({
    status: 422,
    description: "The pickupdate is not valid, it shouldn't be in the past",
    schema: {
      example: {
        statusCode: 422,
        message:  "The pickup Date is not valid, Please pick up another Date rather it's today or in the future",
        error: "Unprocessable Entity",
      },
    },
  })
  @ApiBearerAuth()


  @Patch("pickup/:orderId")
  async updatepickUpDate(@Param("orderId") orderId: string, @Body() updatepickUpDateDTo: UpdatepickUpDateCommandDto, @Req() req) {
    try {
      let token = req.headers['authorization']?.split(" ")[1]
      let infoUser = validateJwt(token);

      if (!infoUser) {
        throw new UnauthorizedException("Try to login again")
      }
      let result = await this.commandService.updateOrderpickUpDate(infoUser.id, orderId, updatepickUpDateDTo)
      if(!result){
        throw new NotFoundException("Ops this command is not found")
      }
      return result
    } catch (e) {
      console.log("there's a problem oooo", e)
      if( e instanceof NotFoundException || e instanceof ForbiddenException || e instanceof BadRequestException || e instanceof UnprocessableEntityException){
        throw e
      }
      throw new BadRequestException("Ops Something went wrong")
    }
  }


}