export declare class TwilioService {
    private client;
    private TWILIO_PHONE_NUMBER;
    private TWILIO_ACCOUNT_SID;
    private TWILIO_AUTH_TOKEN;
    constructor();
    sendOtpSms(phoneNumber: string, otp: string): Promise<string>;
}
