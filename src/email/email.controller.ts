import { Controller, Post, Query, InternalServerErrorException, HttpCode, HttpStatus } from '@nestjs/common';
import { EmailService } from './email.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from 'src/auth/public.decorator';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Public()
  @Post('/send-otp')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Send OTP' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'OTP sent successfully',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Failed to send OTP email',
  })
  async sendOtp(@Query('email') email: string) {
    const result = await this.emailService.sendOtp(email);
    if (!result.success) {
      throw new InternalServerErrorException('Failed to send OTP email');
    }
    return { message: 'OTP sent successfully' };
  }

}
