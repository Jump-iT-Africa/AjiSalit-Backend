import { Controller, Get, Post, Body, Patch, Param, Delete, Req, BadRequestException, NotFoundException, UnauthorizedException, ForbiddenException, Put } from '@nestjs/common';
import { CommandService } from './command.service';
import { CreateCommandDto } from './dto/create-command.dto';
import { UpdateCommandDto } from './dto/update-command.dto';
import { validateJwt } from "../services/verifyJwt"
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import ResponseDto from "./dto/response-command.dto"
import { throwError } from 'rxjs';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { isInstance } from 'class-validator';

@ApiTags('Orders ')
@Controller('order')
export class CommandController {
  constructor(private readonly commandService: CommandService) { }

  @Post()
  @ApiOperation({ summary: "Give the company the ability to add new order" })
  @ApiResponse({
    status: 200,
    description: 'the response returns the details of the Order ',
    type: ResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized error: the user is not logged in ',
    schema: {
      example: {
        statusCode: 401,
        message: "حاول تسجل مرة أخرى",
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
              message: "تأكد من الحالة، مبلغ ديال تسبيق كيتستعمل غير فحالة التسبيق",
              error: 'Unprocessable Entity',
            }
          },
          "Invalid date": {
            value: {
              statusCode: 422,
              message: "تاريخ ماشي صحيح تأكد مرة أخرى",
              error: 'Unprocessable Entity',
            }
          },
          "The Advanced amout is bigger than Price": {
            value: {
              statusCode: 422,
              message: "مبلغ التسبيق خاص اكون صغر من المبلغ الاجمالي، تأكد مرة أخرى",
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
        message: "هاد الكود مستعمل",
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
        message: "ممسموحش لك تزيد طلب",
        error: 'forbidden error',
      },
    },
  })
  create(@Body() createCommandDto: CreateCommandDto, @Req() req) {
    try {
      let token = req.headers['authorization'];
      let infoUser = validateJwt(token);
      if (!infoUser) {
        throw new UnauthorizedException("حاول تسجل مرة أخرى")
      }
      if (infoUser.role !== "company") {
        throw new ForbiddenException("ممسموحش لك تزيد طلب")
      }
      //guard to add later, those who has company role are the one who can create the offer 
      const authentificatedId = infoUser.id;
      return this.commandService.create(createCommandDto, authentificatedId);
    } catch (e) {
      // console.log(e)
      if (e instanceof JsonWebTokenError)
        throw new UnauthorizedException("حاول تسجل مرة أخرى")
      if (e instanceof ForbiddenException) {
        throw new ForbiddenException("ممسموحش لك تزيد طلب")
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
    example: "مبروك تم مسح رمز بنجاح"
  })
  @ApiResponse({
    status: 403,
    description: 'Fobidden error: the user has company role and is not allowed to scan the qr code',
    schema: {
      example: {
        statusCode: 403,
        message: "ممسموحش لك مسح QR هاد الخاصية غير المستعملين العاديين",
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
        message: "حاول تسجل مرة أخرى",
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
        message: "طلب مكاينش تأكد من رمز مرة أخرى",
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

  scanedUserId(@Param('qrcode') qrcode: string, @Req() req) {
    try {
      let token = req.headers['authorization'];
      let infoUser = validateJwt(token);
      if (!infoUser) {
        throw new UnauthorizedException("حاول تسجل مرة أخرى")
      }
      if (infoUser.role !== "client" && infoUser.role !== "admin") {
        throw new ForbiddenException("ممسموحش لك مسح QR هاد الخاصية غير المستعملين العاديين")
      }
      return this.commandService.scanedUserId(qrcode, infoUser.id);

    } catch (e) {
      if (e instanceof ForbiddenException) {
        throw new ForbiddenException("ممسموحش لك مسح QR هاد الخاصية غير المستعملين العاديين")
      }
      if (e instanceof JsonWebTokenError || e instanceof TokenExpiredError)
        throw new UnauthorizedException("حاول تسجل مرة أخرى")
      throw new BadRequestException("ops smth went wrong")
    }

  }


  @Get()
  @ApiOperation({ summary: "The client or the company can check their orders" })

  @ApiResponse({
    status: 401,
    description: 'Unauthorized error: the user is not logged in ',
    schema: {
      example: {
        statusCode: 401,
        message: "حاول تسجل مرة أخرى",
        error: 'Unauthorized error',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request: new exception',
    schema: {
      example: "حاول مرة خرى",
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
                  "city": "rabat",
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
                  "city": "rabat",
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
            value: "ماكين حتا طلب",
          },
      
        },
      },
    }
  })
  findAll(@Req() req) {
    try {
      let token = req.headers['authorization'];
      let infoUser = validateJwt(token);
      console.log(infoUser)
      if (!infoUser) {
        throw new UnauthorizedException("حاول تسجل مرة أخرى")
      }
      return this.commandService.findAll(infoUser.id, infoUser.role);
    }catch(e){
      console.log(e);
      if (e instanceof JsonWebTokenError || e instanceof TokenExpiredError)
        throw new UnauthorizedException("حاول تسجل مرة أخرى")
      throw new BadRequestException("حاول مرة خرى")
    }

  }

  @Get(':id')
  @ApiOperation({ summary: "The client or the company can see th details of their sepefic order" })
  @ApiResponse({
    status: 200,
    description: 'The client or the company check the details of order successfully',
    type:ResponseDto
  })

  @ApiResponse({
    status: 400,
    description: 'Bad Request: new exception',
    content: {
      'application/json': {
        examples: {
          "The id of an order is not valid mongodbId": {
            value: {
                "message": "رقم ديال طلب خطء حاول مرة أخرى",
                "error": "Bad Request",
                "statusCode": 400
            },

          },
          "Something happend that can crash the app":{
            value: "حاول مرة خرى"
          },
      },
    },
  }
  })
  @ApiResponse({
    status: 404,
    description: 'Not found exception: the order is not found',
    schema: {
      example:{
        "message": "ماكين حتا طلب",
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
        message: "حاول تسجل مرة أخرى",
        error: 'Unauthorized error',
      },
    },
  })

  findOne(@Param('id') id: string, @Req() req) {
    try{
      let token = req.headers['authorization'];
      let infoUser = validateJwt(token);
      console.log(infoUser)
      if (!infoUser) {
        throw new UnauthorizedException("حاول تسجل مرة أخرى")
      }
      return this.commandService.findOne(id, infoUser);
    }catch(e){
      if (e instanceof JsonWebTokenError || e instanceof TokenExpiredError)
        throw new UnauthorizedException("حاول تسجل مرة أخرى")
      throw new BadRequestException("حاول مرة خرى")
    }
  }

  @Put(':id')
  @ApiOperation({ summary: "The company owner can update his own order" })
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
                "message": "رقم ديال طلب خطء حاول مرة أخرى",
                "error": "Bad Request",
                "statusCode": 400
            },

          },
          "Something happend that can crash the app":{
            value: "حاول مرة خرى"
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
        message: "حاول تسجل مرة أخرى",
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
        message: "ممسموحش لك تبدل هاد طلب",
        error: 'forbidden error',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Not found exception: the order not found',
    schema: {
      example:{
        "message": "طلب ديالك مكاينش",
        "error": "Not Found",
        "statusCode": 404
    }
    },
  })
  update(@Param('id') id: string, @Body() updateCommandDto: UpdateCommandDto, @Req() req) {
    try{
      let token = req.headers['authorization'];
      let infoUser = validateJwt(token);
      // console.log(infoUser)
      if (!infoUser) {
        throw new UnauthorizedException("حاول تسجل مرة أخرى")
      }
      if(infoUser.role !== "company"){
        throw new ForbiddenException("ممسموحش لك تبدل هاد طلب")
      }
      return this.commandService.update(infoUser.id, id, updateCommandDto);

    }catch(e){
      console.log(e)
      if (e instanceof JsonWebTokenError || e instanceof TokenExpiredError)
        throw new UnauthorizedException("حاول تسجل مرة أخرى")
      if(e instanceof ForbiddenException){
        throw new ForbiddenException("ممسموحش لك تبدل هاد طلب")
      }
      throw new BadRequestException("حاول مرة خرى")
    }

  }

  @Delete(':id')
  @ApiOperation({summary:"The company order want to delete an order"})
  @ApiResponse({
    status: 200,
    description: "The company owner deletes the order successfully",
    example:"تم مسح طلب بنجاح"
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized error: the user is not logged in ',
    schema: {
      example: {
        statusCode: 401,
        message: "حاول تسجل مرة أخرى",
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
        message: "ممسموحش لك تمسح هاد طلب",
        error: 'forbidden error',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Not found exception: the order not found',
    schema: {
      example:{
        "message": "طلب ديالك مكاينش",
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
                "message": "رقم ديال طلب خطء حاول مرة أخرى",
                "error": "Bad Request",
                "statusCode": 400
            },

          },
          "Something happend that can crash the app":{
            value: "حاول مرة خرى"
          },
      },
    },
  }
  })

  remove(@Param('id') id: string, @Req() req) {
    try{
      let token = req.headers['authorization'];
      let infoUser = validateJwt(token);
      if (!infoUser) {
        throw new UnauthorizedException("حاول تسجل مرة أخرى")
      }
      if(infoUser.role !== "company"){
        throw new ForbiddenException("ممسموحش لك تمسح هاد طلب")
      }
      return this.commandService.deleteOrder(id, infoUser.id);
    }catch(e){
      console.log(e);
      if (e instanceof JsonWebTokenError || e instanceof TokenExpiredError)
        throw new UnauthorizedException("حاول تسجل مرة أخرى")
      if(e instanceof ForbiddenException){
        throw new ForbiddenException("ممسموحش لك تبدل هاد طلب")
      }
      throw new BadRequestException("حاول مرة خرى")
    }
  }
}
