import { Inject, Injectable } from "@nestjs/common";
import * as admin from 'firebase-admin';

@Injectable()
export class FcmService {
  constructor(
    @Inject('FIREBASE_APP') private firebaseApp: admin.app.App) {}
  async sendNotificationToDevice(deviceToken: string) {
      const message = {
        data: {
          message: 'Hello, this is a test notification!',
        },
        token: deviceToken,
      };
      try {
        const response = await this.firebaseApp.messaging().send(message);
        return { success: true, messageId: response };
      } catch (error) {
        console.error('Error sending notification:', error);
        return { success: false, error: error.message };
      }
    }
  }