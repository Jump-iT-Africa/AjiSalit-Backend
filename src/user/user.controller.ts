import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, Put, BadRequestException, Req, UnauthorizedException, NotFoundException, ForbiddenException, UseGuards } from '@nestjs/common';
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
import { UpdateFirstNameDto } from './dto/UpdatesDtos/update-user-first-name.dto';
import { UpdateLastNameDto } from './dto/UpdatesDtos/update-user-last-name.dto';
import { UpdateCityDto } from './dto/UpdatesDtos/update-user-city-name.dto';
import { UpdateCompanyNameDto } from './dto/UpdatesDtos/update-user-company-name.dto';
import { UpdateFieldDto } from './dto/UpdatesDtos/update-user-field.dto';
import { ResoponseCompanyDto } from './dto/ResponseDto/response-company.dto';
import { ResoponseUpdateCompanyDto } from './dto/ResponseDto/reponse-update-company.dto';
import { AdminRoleGuard } from './guards/admin-role.guard';
import { UpdatePocketBalance } from './dto/UpdatesDtos/update-pocket.dto';

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

  @ApiOperation({ summary: 'the admin can preview all the users info' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'the response returns the info of companies',
    content: {
      'application/json': {
        examples: {
          "Info of companies": {
          value:  [{
              "pocket": 250,
              "_id": "68189f73271ae1b74abf888e",
              "Fname": "Salima BHMD",
              "Lname": "company",
              "companyName": null,
              "role": "company",
              "phoneNumber": "+212698888311",
              "password": "$2b$10$12L4nfRf65G72im3xw/z.eIjqOZB/y/XCxUN9QKePoA2MNKPWsNyG",
              "city": "rabat",
              "field": "pressing",
              "ice": 0,
              "ownRef": "C79D568E",
              "listRefs": [],
              "createdAt": "2025-05-05T11:22:27.314Z",
              "updatedAt": "2025-05-05T11:22:27.314Z",
              "__v": 0
            }],
          },

        },
      },
    }

  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized error: the admin should be authentificated',
    schema: {
      example: {
        "message": 'kindly try to login again',
        "error": "Unauthorized",
        "statusCode": 401
      }
    },
  })

  @ApiResponse({
    status: 403,
    description: 'Forbidden error: Only users who have admin role can access to this route',
    schema: {
      example: {
        "message": 'Osp only admins can access to this route',
        "error": "Forbidden",
        "statusCode": 403
      }
    },
  })


  @ApiResponse({
    status: 400,
    description: 'Bad error : something breaks down',
    schema: {
      example: {
        "message": "Ops try again",
        "error": "Bad Request Exception",
        "statusCode": 400
      }
    },
  })

  @Get("companies")
  @UseGuards(AdminRoleGuard)
  async getAllCompanies(){
    try{
      let result = await this.userService.getAllCompanies()
      return result
    }catch(e){
      if(e instanceof NotFoundException || e instanceof UnauthorizedException || e instanceof JsonWebTokenError){
        throw e
      }
      console.log("There's an error ", e)
      throw new   BadRequestException("Ops try again")
    }
  }

  @Get("clients")
  @UseGuards(AdminRoleGuard)
  async getAllClients(){
    try{
      let result = await this.userService.getAllClients()
      return result
    }catch(e){
      if(e instanceof NotFoundException || e instanceof UnauthorizedException || e instanceof JsonWebTokenError){
        throw e
      }
      console.log("There's an error ", e)
      throw new   BadRequestException("Ops try again")
    }
  }


  @Patch('pocket/:companyId')
  @UseGuards(AdminRoleGuard)
  async updatePocketBalance(@Param() companyId:string, @Body() updateBalance: UpdatePocketBalance){
    try{
      return await this.userService.updatePocketBalance(companyId,updateBalance)
    }catch(e){
      if(e instanceof NotFoundException || e instanceof UnauthorizedException || e instanceof JsonWebTokenError){
        throw e
      }
      console.log("There's an error ", e)
      throw new BadRequestException("Ops try again")

    }
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
        "message": "try again",
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
        "message": "The account not found",
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
        throw new UnauthorizedException("Try to login again")
      }
      throw new BadRequestException("try again")
    }
  }


  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: "the user or the company owner delete his account " })
  @ApiResponse({
    status: 200,
    description: "The user or the company owner deletes his account successfully",
    example: "The account was deleted successfully"
  })
  @ApiResponse({
    status: 400,
    description: 'Bad error : something breaks down',
    schema: {
      example: {
        "message": "try again",
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
        message: "The account not found",
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
        throw new UnauthorizedException("try to login again")
      if (e instanceof ForbiddenException) {
        throw new ForbiddenException("You are not allowed to update this oder")
      }
      throw new BadRequestException("Please try again")
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
        message: "the user not found ",
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






  @ApiOperation({summary: "This method allows users to change their first names"})
  @ApiBearerAuth()

  @ApiBody({
    type: UpdateFirstNameDto,
  })
  @ApiResponse({
    status: 200,
    description: 'the first name provided is valid and the user updates it successfully',
    type: ResoponseUpdateCompanyDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Something went wrong',
        content: {
          'application/json': {
              examples: {
                  "Something went wrong": {
                      value: {
                        message: "Ops, the user's first name didn't update",
                        error: 'Bad Request Exception',
                        statusCode: 400,
                      }
                  },
                  "Empty body without First name": {
                      value: {
                        "message": [
                            "the first name is required and shouldn't be empty",
                            "The first name should be string"
                        ],
                        "error": "Bad Request",
                        "statusCode": 400
                    }
              },
      }
      },
    },
  })
   
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or expired token',
    schema: {
      example: {
        message: "Try to login again",
        error: 'Unauthorized',
        statusCode: 401,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Not found - User not found',
    schema: {
      example: {
        message: "The user not found, Try again",
        error: 'NotFount',
        statusCode: 404,
      },
    },
  })

  @Patch("firstname")
  async updateFirstName(@Body() updateFirstName:UpdateFirstNameDto, @Req() req){
    try{
      let token = req.headers['authorization']?.split(" ")[1]
      let infoUser = validateJwt(token);

      if (!infoUser) {
        throw new UnauthorizedException("Try to login again")
      }
      let result = await this.userService.UpdateFirstName(infoUser.id, updateFirstName)
      return result
    }catch(e){
      if(e instanceof NotFoundException || e instanceof UnauthorizedException || e instanceof BadRequestException){
        throw e 
      }
      if(e instanceof JsonWebTokenError){
        throw new UnauthorizedException("Try to login again")
      }
      console.log("There's an error :",e)

    }
  }


  @ApiOperation({summary: "This method allows users to change their last names"})
  @ApiBearerAuth()

  @ApiBody({
    type: UpdateLastNameDto,
  })
  @ApiResponse({
    status: 200,
    description: 'the last name provided is valid and the user updates it successfully',
    type: ResoponseUpdateCompanyDto,
  })

  @ApiResponse({
    status: 400,
    description: 'Something went wrong',
        content: {
          'application/json': {
              examples: {
                  "Something went wrong": {
                      value: {
                        message: "Ops, the user's last name didn't update",
                        error: 'Bad Request Exception',
                        statusCode: 400,
                      }
                  },
                  "Last name is required but not available": {
                      value: {
                        "message": [
                          "the last name is required and shouldn't be empty",
                          "The last name should be string"
                      ],
                      "error": "Bad Request",
                      "statusCode": 400
                    }
              },
      }
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or expired token',
    schema: {
      example: {
        message: "Try to login again",
        error: 'Unauthorized',
        statusCode: 401,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Not found - User not found',
    schema: {
      example: {
        message: "The user not found, Try again",
        error: 'NotFount',
        statusCode: 404,
      },
    },
  })

  @Patch("lastname")
  async updateLastName(@Body() updateLastNameDto:UpdateLastNameDto, @Req() req){
    try{
      let token = req.headers['authorization']?.split(" ")[1]
      let infoUser = validateJwt(token);

      if (!infoUser) {
        throw new UnauthorizedException("Try to login again")
      }
      let result = await this.userService.UpdateLastName(infoUser.id, updateLastNameDto)
      return result

    }catch(e){
      if(e instanceof NotFoundException || e instanceof UnauthorizedException || e instanceof BadRequestException){
        throw e 
      }
      if(e instanceof JsonWebTokenError){
        return "JWT must be provided, try to login again"
      }
      console.log("There's an error :",e)
    }
  }


  @ApiOperation({summary: "This method allows users to change their cities"})
  @ApiBearerAuth()
  @ApiBody({
    type: UpdateCityDto,
  })
  @ApiResponse({
    status: 200,
    description: 'The city provided is valid and the user updates it successfully',
    type: ResoponseUpdateCompanyDto,
  })

  @ApiResponse({
    status: 400,
    description: 'Something went wrong',
        content: {
          'application/json': {
              examples: {
                  "Something went wrong": {
                      value: {
                        message: "Ops, the user's city didn't update",
                        error: 'Bad Request Exception',
                        statusCode: 400,
                      }
                  },
                  "City is not sent or not string": {
                      value: {
                        "message": [
                          "the City is required and shouldn't be empty",
                          "The City should be string"
                      ],
                      "error": "Bad Request",
                      "statusCode": 400
                    }
              },
      }
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or expired token',
    schema: {
      example: {
        message: "Try to login again",
        error: 'Unauthorized',
        statusCode: 401,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Not found - User not found',
    schema: {
      example: {
        message: "The user not found, Try again",
        error: 'NotFount',
        statusCode: 404,
      },
    },
  })
  

  @Patch("city")
  async updateCityName(@Body() updateCityNameDto:UpdateCityDto, @Req() req){
    try{
      let token = req.headers['authorization']?.split(" ")[1]
      let infoUser = validateJwt(token);

      if (!infoUser) {
        throw new UnauthorizedException("Try to login again")
      }
      let result = await this.userService.UpdateCityName(infoUser.id, updateCityNameDto)
      return result
    }catch(e){
      if(e instanceof NotFoundException || e instanceof UnauthorizedException || e instanceof BadRequestException){
        throw e 
      }
      if(e instanceof JsonWebTokenError){
        return "JWT must be provided, try to login again"
      }
      console.log("There's an error :",e)
    }
  }


  @ApiOperation({summary: "This method allows users to change their companies name"})
  @ApiBearerAuth()
  @ApiBody({
    type: UpdateCompanyNameDto,
  })
  @ApiResponse({
    status: 200,
    description: 'The company name provided is valid and the user updates it successfully',
    type: ResoponseUpdateCompanyDto,
  })

  @ApiResponse({
    status: 400,
    description: 'Something went wrong',
        content: {
          'application/json': {
              examples: {
                  "Something went wrong": {
                      value: {
                        message: "Ops, the user's company name didn't update",
                        error: 'Bad Request Exception',
                        statusCode: 400,
                      }
                  },
                  "Company name is not sent or its format not string": {
                      value: {
                        "message": [
                          "The company name can not be empty",
                          "The company name should be string"
                      ],
                      "error": "Bad Request",
                      "statusCode": 400
                    }
              },
      }
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or expired token',
    schema: {
      example: {
        message: "Try to login again",
        error: 'Unauthorized',
        statusCode: 401,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Not found - User not found',
    schema: {
      example: {
        message: "The user not found, Try again",
        error: 'NotFount',
        statusCode: 404,
      },
    },
  })
  

  @Patch("companyname")
  async updatecompanyName(@Body() updateCompanyNameDto:UpdateCompanyNameDto, @Req() req){
    try{
      let token = req.headers['authorization']?.split(" ")[1]
      let infoUser = validateJwt(token);

      if (!infoUser) {
        throw new UnauthorizedException("Try to login again")
      }
      let result = await this.userService.UpdateCompanyName(infoUser.id, updateCompanyNameDto)
      return result

    }catch(e){
      if(e instanceof NotFoundException || e instanceof UnauthorizedException || e instanceof BadRequestException){
        throw e 
      }
      if(e instanceof JsonWebTokenError){
        return "JWT must be provided, try to login again"
      }
      console.log("There's an error :",e)
    }
  }

  @ApiOperation({summary: "This method allows users to change their field"})
  @ApiBearerAuth()
  @ApiBody({
    type: UpdateFieldDto,
  })
  @ApiResponse({
    status: 200,
    description: 'The Field provided is valid and the user updates it successfully',
    type: ResoponseUpdateCompanyDto,
  })

  @ApiResponse({
    status: 400,
    description: 'Something went wrong',
        content: {
          'application/json': {
              examples: {
                  "Something went wrong": {
                      value: {
                        message: "Ops, the user's field didn't update",
                        error: 'Bad Request Exception',
                        statusCode: 400,
                      }
                  },
                  "Field is not sent or its format not string": {
                      value: {
                        "message": [
                          "the field should not be empty",
                          "The field should be string"
                      ],
                      "error": "Bad Request",
                      "statusCode": 400
                    }
              },
      }
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or expired token',
    schema: {
      example: {
        message: "Try to login again",
        error: 'Unauthorized',
        statusCode: 401,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Not found - User not found',
    schema: {
      example: {
        message: "The user not found, Try again",
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })

  @Patch("field")
  async updateField(@Body() updateFieldDto:UpdateFieldDto, @Req() req){
    try{
      let token = req.headers['authorization']?.split(" ")[1]
      let infoUser = validateJwt(token);

      if (!infoUser) {
        throw new UnauthorizedException("Try to login again")
      }
      let result = await this.userService.UpdateField(infoUser.id, updateFieldDto)
      return result

    }catch(e){
      if(e instanceof NotFoundException || e instanceof UnauthorizedException || e instanceof BadRequestException){
        throw e 
      }
      if(e instanceof JsonWebTokenError){
        return "JWT must be provided, try to login again"
      }
      console.log("There's an error :",e)
    }
  }






  }
