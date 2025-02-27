import { Module } from '@nestjs/common';
import { OtpService } from './Otp.service';


@Module({
    providers: [OtpService],
    exports: [OtpService]
  })
  export class OtpModule {}