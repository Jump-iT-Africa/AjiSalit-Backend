import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { validateJwt } from 'src/services/verifyJwt';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post(':recevierId')
  createNotification(@Param("recevierId") recevierId:string, @Body() createNotificationDto: CreateNotificationDto, @Req() req) {
    try{
      // console.log(recevierId)
      let token = req.headers.authorization;
      if(!token){
        throw new UnauthorizedException("you aren't allowed to perform this action, please login and try again")
      }
      let infoUser = validateJwt(token);
      if(!infoUser){
        throw new UnauthorizedException("you have to login again")
      }
      return this.notificationsService.createNewNotification(recevierId, infoUser.id, createNotificationDto);

    }catch(e){
      console.log(e)
      throw new BadRequestException("ops smth went wrong")
    }
  }

  @Get(':orderId/:recieverId')
  notifyOrderCompleted(@Param("orderId") orderId: string,@Param("recieverId") receiverId:string, @Req() req){
    try{
      let token = req.headers.authorization;
      if(!token){
        throw new UnauthorizedException("you aren't allowed to perform this action, please login and try again")
      }
      let infoUser = validateJwt(token);
      if(!infoUser){
        throw new UnauthorizedException("you have to login again")
      }
      return this.notificationsService.notificationCompleteOrder(orderId, infoUser,receiverId)
    }catch(e){
      console.log(e)
      throw new BadRequestException("Ops smth went wrong")
    }
  }
  @Get()
  findAll() {
    return this.notificationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notificationsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNotificationDto: UpdateNotificationDto) {
    return this.notificationsService.update(+id, updateNotificationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notificationsService.remove(+id);
  }
}
