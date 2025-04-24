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
      this.logger.log(`yeeeeee connected ${userId} with socketid`,client.id);

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
  @SubscribeMessage('statusUpdate')
  async handleStatusNotification(orderId: string, clientId: string, companyId: string) {
    try {
      const clientSocketData = await this.userService.findOne(clientId);
      const clientSocketId = clientSocketData?.socketId
      console.log('yeeeeeeeeeee socket id', clientSocketId);
      
      if (clientSocketId) {
        await this.notificationService.createNewNotification( clientId, orderId,
          {
            message: `طلبك رقم ${orderId} جاهز للتسليم من ${companyId}`
          })

        this.server.to(clientSocketId).emit('newNotification', {
          type: 'statusUpdate',
          message: `طلبك رقم ${orderId} جاهز للتسليم من ${companyId}`,
          orderId: orderId
        })
        this.logger.log(`notification sent to client: ${clientId}`);
      }
    } catch (error) {
      this.logger.error(`error sending notification: ${error.message}`);
    }

  }
}

 


  


  

  

