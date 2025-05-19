import { Controller, Post, Query, InternalServerErrorException } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('/send-otp')
async sendOtp(@Query('email') email: string) {
  const result = await this.emailService.sendOtp(email);
  if (!result.success) {
    throw new InternalServerErrorException('Failed to send OTP email');
  }
  return { message: 'OTP sent successfully' };
}

}
