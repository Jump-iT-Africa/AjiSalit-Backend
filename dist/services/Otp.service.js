"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpService = void 0;
const common_1 = require("@nestjs/common");
const client_sns_1 = require("@aws-sdk/client-sns");
let OtpService = class OtpService {
    constructor() {
        this.snsClient = new client_sns_1.SNSClient({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
            }
        });
    }
    async sendOtpSms(phoneNumber, otpCode) {
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
            const command = new client_sns_1.PublishCommand(params);
            const response = await this.snsClient.send(command);
            return !!response.MessageId;
        }
        catch (error) {
            console.error('Failed to send OTP:', error);
            return false;
        }
    }
    generateOtp(length = 6) {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
};
exports.OtpService = OtpService;
exports.OtpService = OtpService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], OtpService);
//# sourceMappingURL=Otp.service.js.map