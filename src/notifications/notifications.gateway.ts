import { SubscribeMessage, WebSocketGateway, WebSocketServer,OnGatewayConnection,OnGatewayDisconnect,ConnectedSocket } from '@nestjs/websockets';
import { Server,Socket } from 'socket.io';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { UserService } from '../user/user.service';
import { validateJwt } from 'src/services/verifyJwt';
import { JsonWebTokenError } from 'jsonwebtoken';

@WebSocketGateway({namespace:"notification", cors:{origin: '*'}})
@Injectable()
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect{
  private readonly logger = new Logger(NotificationsGateway.name)

  @WebSocketServer()
  server:Server

  constructor(
    private readonly notificationService: NotificationsService,
    private readonly userService: UserService,
  ){}

  // @SubscribeMessage('message')
  async handleConnection(client: any){
    const token = client.handshake.headers.authorization;
    if (!token) {
      client.disconnect()
      throw new UnauthorizedException('please try to login again')
    };
    const infoUser = validateJwt(token);
    if(!infoUser){
      client.disconnect()
      throw new UnauthorizedException('the user must loggin')
    }
    let userId = infoUser.id
    try{
      let updateSocketId = await this.userService.updateSocketId(userId,client.id)
      this.logger.log(`yeeeeee connected: ${userId}, with this socketid`,client.id);

    }catch(e){
      console.log('message')
      client.disconnect()
      if(e instanceof JsonWebTokenError){
        throw new UnauthorizedException('please try to login again')
      }
    }

  }
  async handleDisconnect(client: Socket) {
    const token = client.handshake.headers.authorization;
    if (!token) {
      client.disconnect()
      throw new UnauthorizedException('please try to login again')
    };
    const infoUser = validateJwt(token);
    if(!infoUser){
      client.disconnect()
      throw new UnauthorizedException('the user must loggin')
    }
    let userId = infoUser.id
    if (userId) {
      await this.userService.updateSocketId(userId, null);
      this.logger.log(`client disconnected: ${userId}`);
    }
  }
  // handleNotification(){
  //   this.server.emit('newNotification', 'hellooooooooo')
    // socket.emit('newNotification', 'hello from server')
  }

