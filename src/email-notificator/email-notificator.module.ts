import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { EmailNotificatorService } from './email-notificator.service';
import { UsersModule } from '../users/users.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [ScheduleModule.forRoot(), UsersModule, EmailModule],
  providers: [EmailNotificatorService],
})
export class EmailNotificatorModule {}
