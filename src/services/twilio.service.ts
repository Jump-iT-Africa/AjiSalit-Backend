import { Injectable } from '@nestjs/common';
import * as Twilio from 'twilio';

@Injectable()
export class TwilioService {
  private client: Twilio.Twilio;
  private TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;
  private TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
  private TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;

  constructor() {
    this.client = Twilio(this.TWILIO_ACCOUNT_SID, this.TWILIO_AUTH_TOKEN);
  }

  async sendOtpSms(phoneNumber: string, otp: string): Promise<string> {
    try {
      const message = await this.client.messages.create({
        body: `Your OTP code is: ${otp}`,
        from: this.TWILIO_PHONE_NUMBER,
        to: phoneNumber,
      });

      console.log('OTP sent successfully:', message.sid);
      return message.sid;
    } catch (error) {
      console.error('Error sending OTP:', error);
      throw new Error('Failed to send OTP');
    }
  }
}
