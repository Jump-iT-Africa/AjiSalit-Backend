import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, Put, BadRequestException, Req, UnauthorizedException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/Logindto/login-user.dto';
import { SignInToAppDto } from './dto/Logindto/signInToApp.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { validateJwt } from "../services/verifyJwt"
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { RoleValidationPipe } from './pipes/RoleValidationPipe'
import { ApiTags, ApiOperation, ApiResponse, ApiBody, refs, ApiExtraModels,ApiBearerAuth } from '@nestjs/swagger';
import { log } from 'console';
import {VerifyNumberDto} from "./dto/Logindto/VerifyPhoneNumber.dto"

ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('register')
  @ApiOperation({ summary: "The user is on the phase one of registration" })
  @ApiBody({
    type: CreateUserDto,
  })
  @ApiResponse({
    status: 200,
    description: "The user register his account successfully",
  })
  @ApiResponse({
    status: 400,
    description: "the user uses an existing number to register or an exception happend",
    content: {
      'application/json': {
        examples: {
          'Using an existing number ': {
            value: {
              "message": "This number is already used, try to login or use another one",
              "error": "Bad Request",
              "statusCode": 400
            }
          },
          'Failed registration for an Exception': {
            value: {
              "message": 'Registration failed',
              "error": "Bad Request",
              "statusCode": 400
            }
          }


        }
      }

    }
  })
  async register(@Body(ValidationPipe) CreateUserDto: CreateUserDto) {
    return this.userService.register(CreateUserDto);
  }


  @Post('login')
  @ApiOperation({ summary: "The user is logged in" })
  @ApiBody({
    type: LoginUserDto,
  })
  @ApiResponse({
    status: 201,
    description: "The user logged in to his account successfully",
    content: {
      'application/json': {
        example: {
          "message": "Login successful",
          "userinfo": {
            "_id": "67c59c87de812842786ca354",
            "phoneNumber": "+212697042835",
            "role": "company",
            "isVerified": true,
            "fullAddress": "Rabat jump it",
            "field": "خياط",
            "ice": 78287383792883820,
            "name": "Company user test"
          },
          "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3YzU5Yzg3ZGU4MTI4NDI3ODZjYTM1NCIsInBob25lTnVtYmVyIjoiKzIxMjY5NzA0MjgzNSIsInJvbGUiOiJjb21wYW55IiwiaWF0IjoxNzQxMTgzMzExLCJleHAiOjE3NDExODY5MTF9.O59zUgikxMKumXe3tJPsyTGlk939p8IVwCwRh8mzdfw"

        }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: "the user uses invalid number or an exception happend",
    content: {
      'application/json': {
        examples: {
          "Using a number that's not registered": {
            value: {
              "message": "This User Does not exists",
              "error": "Bad Request",
              "statusCode": 400
            }
          },
          'Password is incorrect': {
            value: {
              "message": "Password incorrect",
              "error": "Bad Request",
              "statusCode": 400
            },
          },
          'Phonenumber is not verified': {
            value: {
              "message": "Phone number not verified",
              "error": "Bad Request",
              "statusCode": 400
            }
          },
          'other Exceptions ': {
            value: {
              "message": "There was an error while login",
              "error": "Bad Request",
              "statusCode": 400
            }
          }


        }
      }

    }
  })

  async login(@Body(ValidationPipe) LoginUserDto: LoginUserDto) {
    return this.userService.login(LoginUserDto);
  }


  @Get(':id')
  @ApiOperation({ summary: 'the user or the company owner can preview their own informations' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'the response returns the info of user ',
    content: {
      'application/json': {
        examples: {
          "Info of user ": {
            value: {
              "name": "client user test",
              "phoneNumber": "+2126970428355",
              "role": "client"
            }
          },
          "Info of company owner": {
            value: {
              "name": "Company user test",
              "phoneNumber": "+212697042835",
              "fullAddress": "Rabat jump it",
              "field": "خياط",
              "ice": 78287383792883820,
              "role": "company"
            },
          },

        },
      },
    }

    // type: UpdateCompanyDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized error: the user should login again using his phone number and password to continue filling his informations',
    schema: {
      example: {
        "message": "حاول تسجل ف الحساب ديالك مرة أخرى",
        "error": "Unauthorized",
        "statusCode": 401
      }
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad error : something breaks down',
    schema: {
      example: {
        "message": "حاول مرة أخرى",
        "error": "Bad Request Exception",
        "statusCode": 400
      }
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Not found exception : the info of user not found',
    schema: {
      example: {
        "message": "حساب مكاينش، حاول مرة أخرى",
        "error": "Not found",
        "statusCode": 404
      }
    },
  })
  findOne(@Param('id') id: string, @Req() req) {
    try {
      let token = req.headers['authorization']?.split(" ")[1];
      let infoUser = validateJwt(token);
      if (!infoUser) {
        throw new UnauthorizedException("Try to login again")
      }
      return this.userService.findOne(id);
    } catch (e) {
      console.log("there's an error", e)
      if (e instanceof JsonWebTokenError || e instanceof TokenExpiredError) {
        throw new UnauthorizedException("حاول تسجل ف الحساب ديالك مرة أخرى")
      }
      throw new BadRequestException("حاول مرة أخرى")
    }
  }


  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: "the user or the company owner delete his account " })
  @ApiResponse({
    status: 200,
    description: "The user or the company owner deletes his account successfully",
    example: "تم مسح الحساب بنجاح"
  })
  @ApiResponse({
    status: 400,
    description: 'Bad error : something breaks down',
    schema: {
      example: {
        "message": "حاول مرة أخرى",
        "error": "Bad Request Exception",
        "statusCode": 400
      }
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized error: the user should login again using his phone number and password to continue filling his informations',
    schema: {
      example: {
        "message": "Try to login again",
        "error": "Unauthorized",
        "statusCode": 401
      }
    },
  })
  deleteAccount(@Param('id') id: string, @Req() req) {
    try {
      let token = req.headers['authorization']?.split(" ")[1];

      let infoUser = validateJwt(token);
      if (!infoUser) {
        throw new UnauthorizedException("Try to login again")
      }
      return this.userService.deleteAccount(id, infoUser.id);
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


  @ApiOperation({ summary: "Update user profile information" })
  @ApiResponse({
    status: 200,
    description: "User profile updated successfully",
  })
  @ApiResponse({
    status: 400,
    description: "Bad request - Invalid data provided",
    schema: {
      example: {
        message: "تعذر تحديث الملف الشخصي",
        error: "Bad Request",
        statusCode: 400
      }
    }
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - Invalid or expired token",
    schema: {
      example: {
        message: "Try to login again",
        error: "Unauthorized",
        statusCode: 401
      }
    }
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden - User doesn't have permission to update this profile",
    schema: {
      example: {
        message: "You are not allowed to update this oder",
        error: "Forbidden",
        statusCode: 403
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: "Not Found - User not found",
    schema: {
      example: {
        message: "المستخدم غير موجود",
        error: "Not Found",
        statusCode: 404
      }
    }
  })
  @ApiBearerAuth()
  @Put(':id')
  updateUserProfile(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Req() req) {
  try {
    let token = req.headers['authorization']?.split(" ")[1];
    let infoUser = validateJwt(token);
    
    if (!infoUser) {
      throw new UnauthorizedException("Try to login again")
    }
    
    if (id !== infoUser.id) {
      throw new ForbiddenException("You are not allowed to update this oder")
    }
    
    return this.userService.updateUserInfo(id, updateUserDto);
  } catch (e) {
      console.log(e);
      if (e instanceof JsonWebTokenError || e instanceof TokenExpiredError)
        throw new UnauthorizedException("حاول تسجل مرة أخرى")
      if (e instanceof ForbiddenException) {
        throw new ForbiddenException("ممسموحش لك تبدل هاد طلب")
      }
      throw new BadRequestException("حاول مرة خرى")
    }
  }

  @Post("verifyNumber")
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Phone number is valid',
    schema: {
      example: {
        statusCode: 200,
        message: 'Phone number is valid',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid data provided',
    schema: {
      example: {
        message: 'Validation failed: Phone number must be in international format (e.g., +212697042868)',
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or expired token',
    schema: {
      example: {
        message: 'حاول تسجل مرة أخرى',
        error: 'Unauthorized',
        statusCode: 401,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: ' Invalid User',
    schema: {
      example: {
        message: 'المستخدم غير موجود',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  async verifyPhone(@Body() verifyNumberDto: VerifyNumberDto) {
    try {
      return this.userService.VerifyNumber(verifyNumberDto.phoneNumber, verifyNumberDto);
    } catch (e) {
        console.log(e);
      }
    } 
  }
