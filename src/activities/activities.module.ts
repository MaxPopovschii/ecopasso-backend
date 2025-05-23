import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivitiesService } from './activities.service';
import { Activity } from './entities/activity.entity';
import { ActivitiesController } from './activities.controller';
import { ActivityData } from './entities/activity-data.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Activity, ActivityData])],
  providers: [ActivitiesService],
  controllers: [ActivitiesController],
  exports: [ActivitiesService],
})
export class ActivitiesModule {}