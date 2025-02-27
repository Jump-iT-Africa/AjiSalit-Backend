import { Injectable } from '@nestjs/common';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';

@Injectable()
export class OtpService {
  private snsClient: SNSClient;

  constructor() {
    this.snsClient = new SNSClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
      }
    });
  }

  async sendOtpSms(phoneNumber: string, otpCode: string): Promise<boolean> {
    try {
      const params = {
        Message: `Your OTP code is: ${otpCode}`,
        PhoneNumber: phoneNumber,
        MessageAttributes: {
          'AWS.SNS.SMS.SenderID': {
            DataType: 'String',
            StringValue: 'YourAppName'
          }
        }
      };

      const command = new PublishCommand(params);
      const response = await this.snsClient.send(command);
      
      return !!response.MessageId;
    } catch (error) {
      console.error('Failed to send OTP:', error);
      return false;
    }
  }

  // Helper method to generate OTP
  generateOtp(length: number = 6): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}