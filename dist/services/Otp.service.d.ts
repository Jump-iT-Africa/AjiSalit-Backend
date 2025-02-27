export declare class OtpService {
    private snsClient;
    constructor();
    sendOtpSms(phoneNumber: string, otpCode: string): Promise<boolean>;
    generateOtp(length?: number): string;
}
