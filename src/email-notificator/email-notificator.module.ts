import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { EmailModule } from '../email/email.module';
import { UsersModule } from '../users/users.module';
import { EmailNotificatorController } from './email-notificator.controller';
import { EmailNotificatorService } from './email-notificator.service';

@Module({
  imports: [ScheduleModule.forRoot(), UsersModule, EmailModule],
  providers: [EmailNotificatorService],
  controllers: [EmailNotificatorController]
})
export class EmailNotificatorModule {}
