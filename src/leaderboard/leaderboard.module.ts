import { Module } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
import { LeaderboardController } from './leaderboard.controller';
import { ActivitiesModule } from '../activities/activities.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [ActivitiesModule, UsersModule],
  providers: [LeaderboardService],
  controllers: [LeaderboardController],
  exports: [LeaderboardService],
})
export class LeaderboardModule {}
