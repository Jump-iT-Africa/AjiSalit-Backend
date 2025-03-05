import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, Put, BadRequestException, Req, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/Logindto/login-user.dto';
import { SignInToAppDto } from './dto/Logindto/signInToApp.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { validateJwt } from "../services/verifyJwt"
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import {RoleValidationPipe} from './pipes/RoleValidationPipe'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';


ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('signin')
  signInToApp(@Body() signInToAppDto: SignInToAppDto) {
    return this.userService.signInToApp(signInToAppDto);
  }

  @Post('register')
  async register(@Body(ValidationPipe) CreateUserDto: CreateUserDto) {
    return this.userService.register(CreateUserDto);
  }

  @Post('verify')
  async verifyOTP(
    @Body('phoneNumber') phoneNumber: string,
    @Body('otp') otp: string,
  ) {
    return this.userService.verifyOTP(phoneNumber, otp);
  }


  @Post('login')
  async login(@Body(ValidationPipe) LoginUserDto: LoginUserDto) {
    return this.userService.login(LoginUserDto);
  }


  @Put(':id')
  @ApiOperation({summary:"The user has to update his information for the first time in order to finish his authentification"})
  @ApiResponse({
    status:401,
    description: 'Unauthorized error: the user should login again using his phone number and password to continue filling his informations',
    schema: {
      example: {
        "message": "حاول تسجل ف الحساب ديالك مرة أخرى",
        "error": "Unauthorized",
        "statusCode": 401
    }
    },
  })
  async updateAuthentifictaion(@Param("id") id, @Body(new RoleValidationPipe()) updateDto: UpdateUserDto | UpdateCompanyDto, @Req() req) {
    try {
      let token = req.headers['authorization'];
      let infoUser = validateJwt(token);
      if (!infoUser) {
        throw new UnauthorizedException("حاول تسجل مرة أخرى")
      }
      if(!updateDto){
        return "خصك تعمر المعلومات ديالك"
      }
      return this.userService.updateAuthentifictaion(id, updateDto, infoUser.id)
    } catch (e) {
      console.log("there's an error", e)
      if(e instanceof JsonWebTokenError || e instanceof TokenExpiredError){
        throw new UnauthorizedException("حاول تسجل ف الحساب ديالك مرة أخرى")
      }
      throw new BadRequestException("حاول مرة أخرى")
    }
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    try{
      let token = req.headers['authorization'];
      let infoUser = validateJwt(token);
      if (!infoUser) {
        throw new UnauthorizedException("حاول تسجل مرة أخرى")
      }
      return this.userService.findOne(id);
    }catch(e){
      console.log("there's an error", e)
      if(e instanceof JsonWebTokenError || e instanceof TokenExpiredError){
        throw new UnauthorizedException("حاول تسجل ف الحساب ديالك مرة أخرى")
      }
      throw new BadRequestException("حاول مرة أخرى")
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.userService.remove(id);
  // }
}
