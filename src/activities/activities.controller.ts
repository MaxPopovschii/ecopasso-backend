import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { Activity } from './entities/activity.entity';

@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Get()
  findAll(): Promise<Activity[]> {
    return this.activitiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Activity> {
    return this.activitiesService.findOne(+id);
  }

  @Post()
  create(@Body() activity: Partial<Activity>): Promise<Activity> {
    return this.activitiesService.create(activity);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.activitiesService.remove(+id);
  }
}