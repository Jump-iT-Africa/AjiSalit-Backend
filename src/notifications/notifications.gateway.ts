import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({namespace:"notification"})
export class NotificationsGateway {
  @WebSocketServer()
  server:Server
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
  handleNotification(){
    this.server.emit('newNotification', 'hellooooooooo')
    // socket.emit('newNotification', 'hello from server')
  }
}
