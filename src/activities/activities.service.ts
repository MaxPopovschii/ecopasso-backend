import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity } from './entities/activity.entity';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(Activity)
    private readonly activitiesRepository: Repository<Activity>,
  ) {}

  findAll(): Promise<Activity[]> {
    return this.activitiesRepository.find({ relations: ['user'] });
  }

  async findOne(id: number): Promise<Activity> {
    const activity = await this.activitiesRepository.findOne({ where: { id }, relations: ['user'] });
    if (!activity) {
      throw new Error(`Activity with id ${id} not found`);
    }
    return activity;
  }

  create(activity: Partial<Activity>): Promise<Activity> {
    return this.activitiesRepository.save(activity);
  }

  async remove(id: number): Promise<void> {
    await this.activitiesRepository.delete(id);
  }
}