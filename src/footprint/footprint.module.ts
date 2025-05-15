import { Module } from '@nestjs/common';
import { FootprintService } from './footprint.service';
import { FootprintController } from './footprint.controller';
import { ActivitiesModule } from '../activities/activities.module';

@Module({
  imports: [ActivitiesModule],
  providers: [FootprintService],
  controllers: [FootprintController],
})
export class FootprintModule {}