import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  Put,
  BadRequestException,
  Req,
  UnauthorizedException,
  NotFoundException,
  ForbiddenException,
  UseGuards,
  ConflictException,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { LoginUserDto } from "./dto/Logindto/login-user.dto";
import { SignInToAppDto } from "./dto/Logindto/signInToApp.dto";
import { UpdateCompanyDto } from "./dto/update-company.dto";
import { validateJwt } from "../services/verifyJwt";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { RoleValidationPipe } from "./pipes/RoleValidationPipe";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  refs,
  ApiExtraModels,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { VerifyNumberDto } from "./dto/Logindto/VerifyPhoneNumber.dto";
import { UpdateFirstNameDto } from "./dto/UpdatesDtos/update-user-first-name.dto";
import { UpdateLastNameDto } from "./dto/UpdatesDtos/update-user-last-name.dto";
import { UpdateCityDto } from "./dto/UpdatesDtos/update-user-city-name.dto";
import { UpdateCompanyNameDto } from "./dto/UpdatesDtos/update-user-company-name.dto";
import { UpdateFieldDto } from "./dto/UpdatesDtos/update-user-field.dto";
import { ResoponseCompanyDto } from "./dto/ResponseDto/response-company.dto";
import { ResoponseUpdateCompanyDto } from "./dto/ResponseDto/reponse-update-company.dto";
import { AdminRoleGuard } from "./guards/admin-role.guard";
import { UpdatePocketBalance } from "./dto/UpdatesDtos/update-pocket.dto";
import { ResoponseCompanyInfoDto } from "./dto/ResponseDto/response-info-company.dto";
import { UpdatePassword } from "./dto/UpdatesDtos/update-password.dto";
import { IsAuthenticated } from "./guards/is-authentificated.guard";

ApiTags("User");
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("register")
  @ApiOperation({ summary: "The user is on the phase one of registration" })
  @ApiBody({
    type: CreateUserDto,
  })
  @ApiResponse({
    status: 201,
    description: "The user register his account successfully",
    example: {
      user: {
        id: "682225f43c8d0b70f6bd9626",
        Fname: "OSM",
        Lname: "BEN",
        companyName: "Aji Salit",
        phoneNumber: "+212697042968",
        role: "company",
        city: "marrakech",
        field: "pressing",
        ice: 12345678910123,
        ownRef: "4AD98224",
        listRefs: [],
      },
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpddjdjdjdjjdjdjdjdjjdjdiIsIkZuYW1lIjoiT1NNIiwiTG5hbWUiOiJCRU4iLCJjb21wYW55TmFtZSI6IkFqaSBTYWxpdCIsInBob25lTnVtYmVyIjoiKzIxMjY5NzA0Mjk2OCIsInJvbGUiOiJjb21wYW55IiwiY2l0eSI6Im1hcnJha2VjaCIsImZpZWxkIjoicHJlc3NpbmciLCJpY2UiOjEyMzQ1Njc4OTEwMTIzLCJvd25SZWYiOiI0QUQ5ODIyNCIsImxpc3RSZWZzIjpbXSwiaWF0IjoxNzQ3MDY4NDA0LCJleHAiOjE3NDk2NjA0MDR9.8M5d7KHlApDYPllvuCUBibZuqG0aUoVTfNyjR_nGnFc",
    },
  })
  @ApiResponse({
    status: 400,
    description:
      "the user uses an existing number to register or an exception happend",
    content: {
      "application/json": {
        examples: {
          "The password contains Letters instead of digits": {
            value: {
              message: ["The password must contain 6 numbers only"],
              error: "Bad Request",
              statusCode: 400,
            },
          },
          "Failed registration for an Exception": {
            value: {
              message: "Registration failed",
              error: "Bad Request",
              statusCode: 400,
            },
          },

          "Sending an empty body": {
            value: {
              message: [
                "Fname should not be empty",
                "Fname must be a string",
                "Lname should not be empty",
                "Lname must be a string",
                "phoneNumber should not be empty",
                "phoneNumber must be a string",
                "password should not be empty",
                "The password must contain 6 numbers only",
                "password must be a string",
              ],
              error: "Bad Request",
              status: 400,
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: "Conflict error: this number is already used",
    schema: {
      example: {
        message: "This number is already used, try to login or use another one",
        error: "Conflict",
        statusCode: 409,
      },
    },
  })
  async register(@Body(ValidationPipe) CreateUserDto: CreateUserDto) {
    return this.userService.register(CreateUserDto);
  }

  @Post("login")
  @ApiOperation({ summary: "The user is logged in" })
  @ApiBody({
    type: LoginUserDto,
  })
  @ApiResponse({
    status: 201,
    description: "The user logged in to his account successfully",
    content: {
      "application/json": {
        example: {
          message: "Login successful",
          userinfo: {
            _id: "67c59c87de812842786ca354",
            phoneNumber: "+212697042835",
            role: "company",
            isVerified: true,
            fullAddress: "Rabat jump it",
            field: "خياط",
            ice: 78287383792883820,
            name: "Company user test",
          },
          token:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3YzU5Yzg3ZGU4MTI4NDI3ODZjYTM1NCIsInBob25lTnVtYmVyIjoiKzIxMjY5NzA0MjgzNSIsInJvbGUiOiJjb21wYW55IiwiaWF0IjoxNzQxMTgzMzExLCJleHAiOjE3NDExODY5MTF9.O59zUgikxMKumXe3tJPsyTGlk939p8IVwCwRh8mzdfw",
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "the user uses invalid number or an exception happend",
    content: {
      "application/json": {
        examples: {
          "Using a number that's not registered": {
            value: {
              message: "This User Does not exists",
              error: "Bad Request",
              statusCode: 400,
            },
          },
          "Password is incorrect": {
            value: {
              message: "Password incorrect",
              error: "Bad Request",
              statusCode: 400,
            },
          },
          "Password contains letters instead of digits or use more than 6 digits":
            {
              value: {
                message: ["The password must contain 6 numbers only"],
                error: "Bad Request",
                statusCode: 400,
              },
            },
          "Phone number is not verified": {
            value: {
              message: "Phone number not verified",
              error: "Bad Request",
              statusCode: 400,
            },
          },
          "Sending an empty body": {
            value: {
              message: [
                "phoneNumber should not be empty",
                "phoneNumber must be a string",
                "password should not be empty",
                "password must be a string",
                "The password must contain 6 numbers only",
              ],
              error: "Bad Request",
              statusCode: 400,
            },
          },
          "Something crushed and caused the Exception": {
            value: {
              message: "There was an error while login",
              error: "Bad Request",
              statusCode: 400,
            },
          },
        },
      },
    },
  })
  async login(@Body(ValidationPipe) LoginUserDto: LoginUserDto) {
    try {
      return this.userService.login(LoginUserDto);
    } catch (e) {
      console.log("there's an error", e);
      if (e instanceof ConflictException) {
        throw e;
      }
      throw e;
    }
  }

  @ApiOperation({
    summary:
      "The admin can preview all the company info and the number of their order",
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: "the response returns the info of companies",
    content: {
      "application/json": {
        examples: {
          "Info of companies": {
            value: [
              {
                _id: "6823886c36a5e048a4bcc32d",
                companyName: "les maitres",
                Lname: "Kissi",
                Fname: "mimoun",
                phoneNumber: "+212600660066",
                city: "وجدة",
                role: "company",
                pocket: 244,
                field: "الخياطة",
                commandCount: 6,
              },
            ],
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized error: the admin should be authentificated",
    schema: {
      example: {
        message: "kindly try to login again",
        error: "Unauthorized",
        statusCode: 401,
      },
    },
  })
  @ApiResponse({
    status: 403,
    description:
      "Forbidden error: Only users who have admin role can access to this route",
    schema: {
      example: {
        message: "Osp only admins can access to this route",
        error: "Forbidden",
        statusCode: 403,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "Bad error : something breaks down",
    schema: {
      example: {
        message: "Ops try again",
        error: "Bad Request Exception",
        statusCode: 400,
      },
    },
  })
  @Get("companies")
  @UseGuards(AdminRoleGuard)
  async getAllCompanies() {
    try {
      let result = await this.userService.getAllCompanies();
      return result;
    } catch (e) {
      if (
        e instanceof NotFoundException ||
        e instanceof UnauthorizedException ||
        e instanceof JsonWebTokenError
      ) {
        throw e;
      }
      console.log("There's an error ", e);
      throw new BadRequestException("Ops try again");
    }
  }

  @ApiOperation({ summary: "The admin can preview all the clients info" })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: "the response returns the info of clients",
    content: {
      "application/json": {
        examples: {
          "Info of clients": {
            value: [
              {
                Fname: "Salima",
                Lname: "BHM",
                city: "Rabat",
                phoneNumber: "+212 0697042868",
                role: "client",
              },
            ],
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized error: the admin should be authentificated",
    schema: {
      example: {
        message: "kindly try to login again",
        error: "Unauthorized",
        statusCode: 401,
      },
    },
  })
  @ApiResponse({
    status: 403,
    description:
      "Forbidden error: Only users who have admin role can access to this route",
    schema: {
      example: {
        message: "Osp only admins can access to this route",
        error: "Forbidden",
        statusCode: 403,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "Bad error : something breaks down",
    schema: {
      example: {
        message: "Ops try again",
        error: "Bad Request Exception",
        statusCode: 400,
      },
    },
  })
  @Get("clients")
  @UseGuards(AdminRoleGuard)
  async getAllClients() {
    try {
      let result = await this.userService.getAllClients();
      return result;
    } catch (e) {
      if (
        e instanceof NotFoundException ||
        e instanceof UnauthorizedException ||
        e instanceof JsonWebTokenError
      ) {
        throw e;
      }
      console.log("There's an error ", e);
      throw new BadRequestException("Ops try again");
    }
  }

  @ApiOperation({
    summary:
      "Only admins can access: get global user statistics (users, clients, companies, admins)",
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: "User statistics retrieved successfully",
    content: {
      "application/json": {
        examples: {
          success: {
            value: {
              "Total Users": 18,
              "Total clients": 10,
              "Total companies": 6,
              "Total admins": 2,
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "Bad Request: Something went wrong during the process",
    content: {
      "application/json": {
        examples: {
          "Generic Error": {
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
    description: "Unauthorized: Token is missing, invalid, or expired",
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
      return await this.userService.getStatistics();
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

  @ApiOperation({
    summary: "The admin can update the balance of pocket of a company",
  })
  @ApiBody({ type: UpdatePocketBalance })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: "the response returns the info of clients",
    type: ResoponseCompanyInfoDto,
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized error: the admin should be authentificated",
    schema: {
      example: {
        message: "kindly try to login again",
        error: "Unauthorized",
        statusCode: 401,
      },
    },
  })
  @ApiResponse({
    status: 403,
    description:
      "Forbidden error: Only users who have admin role can access to this route",
    schema: {
      example: {
        message: "Osp only admins can access to this route",
        error: "Forbidden",
        statusCode: 403,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "Bad Request: new exception",
    content: {
      "application/json": {
        examples: {
          "Negative number ": {
            value: {
              message: ["The pocket number should be positive or 0 "],
              error: "Bad Request",
              statusCode: 400,
            },
          },
          "Empty Balance or invalid format ": {
            value: {
              message: [
                "The pocket number should be positive or 0 ",
                "The pocket number should not be empty and should be a valid number",
                "the pocket price must be a valid number",
              ],
              error: "Bad Request",
              statusCode: 400,
            },
          },

          "Something happend that can crash the app": {
            value: "Ops try again",
          },
        },
      },
    },
  })
  @Patch("pocket/:companyId")
  @UseGuards(AdminRoleGuard)
  async updatePocketBalance(
    @Param("companyId") companyId: string,
    @Body() updateBalance: UpdatePocketBalance
  ) {
    try {
      return await this.userService.updatePocketBalance(
        companyId,
        updateBalance
      );
    } catch (e) {
      if (
        e instanceof NotFoundException ||
        e instanceof UnauthorizedException ||
        e instanceof JsonWebTokenError
      ) {
        throw e;
      }
      console.log("There's an error ", e);
      throw new BadRequestException("Ops try again");
    }
  }

  @Get()
  @UseGuards(IsAuthenticated)
  @ApiOperation({
    summary: "the user or the company owner can preview their own informations",
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: "the response returns the info of user ",
    content: {
      "application/json": {
        examples: {
          "Info of user ": {
            value: {
              id: "6825afe8f3533a1ef38e6167",
              Fname: "salimmaaaa",
              Lname: "salimmaaaa",
              city: "marrakech",
              phoneNumber: "+212697542868",
              role: "client",
              pocket: 0,
              ownRef: "80B53078",
            },
          },
          "Info of company owner": {
            value: {
              id: "6825ad7382e37a3d07b4ea59",
              Fname: "BOUHAMIDI",
              Lname: "BOUHAMIDI",
              companyName: "Aji Salit",
              city: "marrakech",
              phoneNumber: "+212697043768",
              field: "pressing",
              ice: 12345678930423,
              role: "company",
              pocket: 250,
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description:
      "Unauthorized error: the user should login again using his phone number and password to continue filling his informations",
    schema: {
      example: {
        message: "Try to login again",
        error: "Unauthorized",
        statusCode: 401,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "Bad error : something breaks down",
    schema: {
      example: {
        message: "try again",
        error: "Bad Request Exception",
        statusCode: 400,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: "Not found exception : the info of user not found",
    schema: {
      example: {
        message: "The account not found",
        error: "Not found",
        statusCode: 404,
      },
    },
  })
  findOne(@Req() req) {
    try {
      return this.userService.findOne(req.user.id);
    } catch (e) {
      console.log("there's an error", e);
      if (e instanceof JsonWebTokenError || e instanceof TokenExpiredError) {
        throw new UnauthorizedException("Try to login again");
      }
      throw new BadRequestException("try again");
    }
  }

  @Delete(":id")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "the user or the company owner delete his account ",
  })
  @ApiResponse({
    status: 200,
    description:
      "The user or the company owner deletes his account successfully",
    example: "The account was deleted successfully",
  })
  @ApiResponse({
    status: 400,
    description: "Bad error : something breaks down",
    schema: {
      example: {
        message: "try again",
        error: "Bad Request Exception",
        statusCode: 400,
      },
    },
  })
  @ApiResponse({
    status: 401,
    description:
      "Unauthorized error: the user should login again using his phone number and password to continue filling his informations",
    schema: {
      example: {
        message: "Try to login again",
        error: "Unauthorized",
        statusCode: 401,
      },
    },
  })
  deleteAccount(@Param("id") id: string, @Req() req) {
    try {
      let token = req.headers["authorization"]?.split(" ")[1];

      let infoUser = validateJwt(token);
      if (!infoUser) {
        throw new UnauthorizedException("Try to login again");
      }
      return this.userService.deleteAccount(id, infoUser.id);
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
        statusCode: 400,
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - Invalid or expired token",
    schema: {
      example: {
        message: "Try to login again",
        error: "Unauthorized",
        statusCode: 401,
      },
    },
  })
  @ApiResponse({
    status: 403,
    description:
      "Forbidden - User doesn't have permission to update this profile",
    schema: {
      example: {
        message: "You are not allowed to update this oder",
        error: "Forbidden",
        statusCode: 403,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: "Not Found - User not found",
    schema: {
      example: {
        message: "The account not found",
        error: "Not Found",
        statusCode: 404,
      },
    },
  })
  @ApiBearerAuth()
  @Put(":id")
  @UseGuards(IsAuthenticated)
  updateUserProfile(
    @Param("id") id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req
  ) {
    try {
      let token = req.headers["authorization"]?.split(" ")[1];
      let infoUser = validateJwt(token);

      if (!infoUser) {
        throw new UnauthorizedException("Try to login again");
      }

      if (id !== infoUser.id) {
        throw new ForbiddenException("You are not allowed to update this oder");
      }

      return this.userService.updateUserInfo(id, updateUserDto);
    } catch (e) {
      console.log(e);
      if (e instanceof JsonWebTokenError || e instanceof TokenExpiredError)
        throw new UnauthorizedException("try to login again");
      if (e instanceof ForbiddenException) {
        throw new ForbiddenException("You are not allowed to update this oder");
      }
      throw new BadRequestException("Please try again");
    }
  }

  @Post("verifyNumber")
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: "Phone number is valid",
    schema: {
      example: {
        statusCode: 200,
        message: "Phone number is valid",
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "Bad request - Invalid data provided",
    schema: {
      example: {
        message:
          "Validation failed: Phone number must be in international format (e.g., +212697042868)",
        error: "Bad Request",
        statusCode: 400,
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - Invalid or expired token",
    schema: {
      example: {
        message: "حاول تسجل مرة أخرى",
        error: "Unauthorized",
        statusCode: 401,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: " Invalid User",
    schema: {
      example: {
        message: "the user not found ",
        error: "Not Found",
        statusCode: 404,
      },
    },
  })
  async verifyPhone(@Body() verifyNumberDto: VerifyNumberDto) {
    try {
      return this.userService.VerifyNumber(
        verifyNumberDto.phoneNumber,
        verifyNumberDto
      );
    } catch (e) {
      console.log(e);
    }
  }

  @ApiOperation({
    summary: "This method allows users to change their first names",
  })
  @ApiBearerAuth()
  @ApiBody({
    type: UpdateFirstNameDto,
  })
  @ApiResponse({
    status: 200,
    description:
      "the first name provided is valid and the user updates it successfully",
    type: ResoponseUpdateCompanyDto,
  })
  @ApiResponse({
    status: 400,
    description: "Something went wrong",
    content: {
      "application/json": {
        examples: {
          "Something went wrong": {
            value: {
              message: "Ops, the user's first name didn't update",
              error: "Bad Request Exception",
              statusCode: 400,
            },
          },
          "Empty body without First name": {
            value: {
              message: [
                "the first name is required and shouldn't be empty",
                "The first name should be string",
              ],
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
    description: "Unauthorized - Invalid or expired token",
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
    description: "Not found - User not found",
    schema: {
      example: {
        message: "The user not found, Try again",
        error: "NotFount",
        statusCode: 404,
      },
    },
  })
  @Patch("firstname")
  async updateFirstName(
    @Body() updateFirstName: UpdateFirstNameDto,
    @Req() req
  ) {
    try {
      let token = req.headers["authorization"]?.split(" ")[1];
      let infoUser = validateJwt(token);

      if (!infoUser) {
        throw new UnauthorizedException("Try to login again");
      }
      let result = await this.userService.UpdateFirstName(
        infoUser.id,
        updateFirstName
      );
      return result;
    } catch (e) {
      if (
        e instanceof NotFoundException ||
        e instanceof UnauthorizedException ||
        e instanceof BadRequestException
      ) {
        throw e;
      }
      if (e instanceof JsonWebTokenError) {
        throw new UnauthorizedException("Try to login again");
      }
      console.log("There's an error :", e);
    }
  }

  @ApiOperation({
    summary: "This method allows users to change their last names",
  })
  @ApiBearerAuth()
  @ApiBody({
    type: UpdateLastNameDto,
  })
  @ApiResponse({
    status: 200,
    description:
      "the last name provided is valid and the user updates it successfully",
    type: ResoponseUpdateCompanyDto,
  })
  @ApiResponse({
    status: 400,
    description: "Something went wrong",
    content: {
      "application/json": {
        examples: {
          "Something went wrong": {
            value: {
              message: "Ops, the user's last name didn't update",
              error: "Bad Request Exception",
              statusCode: 400,
            },
          },
          "Last name is required but not available": {
            value: {
              message: [
                "the last name is required and shouldn't be empty",
                "The last name should be string",
              ],
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
    description: "Unauthorized - Invalid or expired token",
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
    description: "Not found - User not found",
    schema: {
      example: {
        message: "The user not found, Try again",
        error: "NotFount",
        statusCode: 404,
      },
    },
  })
  @Patch("lastname")
  async updateLastName(
    @Body() updateLastNameDto: UpdateLastNameDto,
    @Req() req
  ) {
    try {
      let token = req.headers["authorization"]?.split(" ")[1];
      let infoUser = validateJwt(token);

      if (!infoUser) {
        throw new UnauthorizedException("Try to login again");
      }
      let result = await this.userService.UpdateLastName(
        infoUser.id,
        updateLastNameDto
      );
      return result;
    } catch (e) {
      if (
        e instanceof NotFoundException ||
        e instanceof UnauthorizedException ||
        e instanceof BadRequestException
      ) {
        throw e;
      }
      if (e instanceof JsonWebTokenError) {
        return "JWT must be provided, try to login again";
      }
      console.log("There's an error :", e);
    }
  }

  @ApiOperation({ summary: "This method allows users to change their cities" })
  @ApiBearerAuth()
  @ApiBody({
    type: UpdateCityDto,
  })
  @ApiResponse({
    status: 200,
    description:
      "The city provided is valid and the user updates it successfully",
    type: ResoponseUpdateCompanyDto,
  })
  @ApiResponse({
    status: 400,
    description: "Something went wrong",
    content: {
      "application/json": {
        examples: {
          "Something went wrong": {
            value: {
              message: "Ops, the user's city didn't update",
              error: "Bad Request Exception",
              statusCode: 400,
            },
          },
          "City is not sent or not string": {
            value: {
              message: [
                "the City is required and shouldn't be empty",
                "The City should be string",
              ],
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
    description: "Unauthorized - Invalid or expired token",
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
    description: "Not found - User not found",
    schema: {
      example: {
        message: "The user not found, Try again",
        error: "NotFount",
        statusCode: 404,
      },
    },
  })
  @Patch("city")
  async updateCityName(@Body() updateCityNameDto: UpdateCityDto, @Req() req) {
    try {
      let token = req.headers["authorization"]?.split(" ")[1];
      let infoUser = validateJwt(token);

      if (!infoUser) {
        throw new UnauthorizedException("Try to login again");
      }
      let result = await this.userService.UpdateCityName(
        infoUser.id,
        updateCityNameDto
      );
      return result;
    } catch (e) {
      if (
        e instanceof NotFoundException ||
        e instanceof UnauthorizedException ||
        e instanceof BadRequestException
      ) {
        throw e;
      }
      if (e instanceof JsonWebTokenError) {
        return "JWT must be provided, try to login again";
      }
      console.log("There's an error :", e);
    }
  }

  @ApiOperation({
    summary: "This method allows users to change their companies name",
  })
  @ApiBearerAuth()
  @ApiBody({
    type: UpdateCompanyNameDto,
  })
  @ApiResponse({
    status: 200,
    description:
      "The company name provided is valid and the user updates it successfully",
    type: ResoponseUpdateCompanyDto,
  })
  @ApiResponse({
    status: 400,
    description: "Something went wrong",
    content: {
      "application/json": {
        examples: {
          "Something went wrong": {
            value: {
              message: "Ops, the user's company name didn't update",
              error: "Bad Request Exception",
              statusCode: 400,
            },
          },
          "Company name is not sent or its format not string": {
            value: {
              message: [
                "The company name can not be empty",
                "The company name should be string",
              ],
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
    description: "Unauthorized - Invalid or expired token",
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
    description: "Not found - User not found",
    schema: {
      example: {
        message: "The user not found, Try again",
        error: "NotFount",
        statusCode: 404,
      },
    },
  })
  @Patch("companyname")
  async updatecompanyName(
    @Body() updateCompanyNameDto: UpdateCompanyNameDto,
    @Req() req
  ) {
    try {
      let token = req.headers["authorization"]?.split(" ")[1];
      let infoUser = validateJwt(token);

      if (!infoUser) {
        throw new UnauthorizedException("Try to login again");
      }
      let result = await this.userService.UpdateCompanyName(
        infoUser.id,
        updateCompanyNameDto
      );
      return result;
    } catch (e) {
      if (
        e instanceof NotFoundException ||
        e instanceof UnauthorizedException ||
        e instanceof BadRequestException
      ) {
        throw e;
      }
      if (e instanceof JsonWebTokenError) {
        return "JWT must be provided, try to login again";
      }
      console.log("There's an error :", e);
    }
  }

  @ApiOperation({ summary: "This method allows users to change their field" })
  @ApiBearerAuth()
  @ApiBody({
    type: UpdateFieldDto,
  })
  @ApiResponse({
    status: 200,
    description:
      "The Field provided is valid and the user updates it successfully",
    type: ResoponseUpdateCompanyDto,
  })
  @ApiResponse({
    status: 400,
    description: "Something went wrong",
    content: {
      "application/json": {
        examples: {
          "Something went wrong": {
            value: {
              message: "Ops, the user's field didn't update",
              error: "Bad Request Exception",
              statusCode: 400,
            },
          },
          "Field is not sent or its format not string": {
            value: {
              message: [
                "the field should not be empty",
                "The field should be string",
              ],
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
    description: "Unauthorized - Invalid or expired token",
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
    description: "Not found - User not found",
    schema: {
      example: {
        message: "The user not found, Try again",
        error: "Not Found",
        statusCode: 404,
      },
    },
  })
  @Patch("field")
  async updateField(@Body() updateFieldDto: UpdateFieldDto, @Req() req) {
    try {
      let token = req.headers["authorization"]?.split(" ")[1];
      let infoUser = validateJwt(token);

      if (!infoUser) {
        throw new UnauthorizedException("Try to login again");
      }
      let result = await this.userService.UpdateField(
        infoUser.id,
        updateFieldDto
      );
      return result;
    } catch (e) {
      if (
        e instanceof NotFoundException ||
        e instanceof UnauthorizedException ||
        e instanceof BadRequestException
      ) {
        throw e;
      }
      if (e instanceof JsonWebTokenError) {
        return "JWT must be provided, try to login again";
      }
      console.log("There's an error :", e);
    }
  }

  @ApiOperation({
    summary: "This method allows users to change their password",
  })
  @ApiBearerAuth()
  @ApiBody({
    type: UpdatePassword,
  })
  @ApiResponse({
    status: 200,
    description: "The password has been updated successfully",
    example: "The password has been updated successfully",
  })
  @ApiResponse({
    status: 400,
    description: "Something went wrong",
    content: {
      "application/json": {
        examples: {
          "Passwords include letters instead of digits": {
            value: {
              message: [
                "The your last password must contain 6 numbers only",
                "The your new password must contain 6 numbers only",
              ],
              error: "Bad Request",
              statusCode: 400,
            },
          },
          "Something went wrong": {
            value: {
              message: "Ops, coudln't update the password",
              error: "Bad Request Exception",
              statusCode: 400,
            },
          },
          "the Body is empty and the passwords(old and new) aren't in a valid format":
            {
              value: {
                message: [
                  "Your old password should not be empty",
                  "The your last password must contain 6 numbers only",
                  "The password should sent as format string like '287398' ",
                  "Your new password should not be empty",
                  "The your new password must contain 6 numbers only",
                  "The new password should sent as format string like '287398'",
                ],
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
    description: "Unauthorized - Invalid or expired token",
    content: {
      "application/json": {
        examples: {
          "The password sent does not match the password of user": {
            value: {
              message: "Ops, your password is incorrect",
              error: "Unauthorized",
              statusCode: 401,
            },
          },
          "The user is not logged in": {
            value: {
              message: "Try to login again",
              error: "Unauthorized",
              statusCode: 401,
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: "Not found - User not found",
    schema: {
      example: {
        message: "The  user not found",
        error: "Not Found",
        statusCode: 404,
      },
    },
  })
  @Patch("password")
  @UseGuards(IsAuthenticated)
  async updatePassword(@Body() updatePasswordDto: UpdatePassword, @Req() req) {
    try {
      return await this.userService.updatePassword(
        updatePasswordDto,
        req.user.id
      );
    } catch (e) {
      if (
        e instanceof NotFoundException ||
        e instanceof UnauthorizedException ||
        e instanceof BadRequestException
      ) {
        throw e;
      }
      console.log("there's an error", e);
      throw new BadRequestException("Ops, coudln't update the password");
    }
  }
}
