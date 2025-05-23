import { Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EmailNotificatorService } from './email-notificator.service';

@ApiTags('email-notificator')
@Controller('email-notificator')
export class EmailNotificatorController {
  constructor(private readonly emailNotificatorService: EmailNotificatorService) {}

  @Post('test')
  async testSend() {
    await this.emailNotificatorService.sendDailyReminders();
    return { message: 'Email di test inviate!' };
  }
}
