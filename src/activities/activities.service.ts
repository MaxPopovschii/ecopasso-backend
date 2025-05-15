import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity } from './entities/activity.entity';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(Activity)
    private readonly activitiesRepository: Repository<Activity>,
  ) {}

  async findAll(page: number = 1, limit: number = 10): Promise<{activities: Activity[], total: number}> {
    const [activities, total] = await this.activitiesRepository.findAndCount({
      relations: ['user'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' }
    });

    return { activities, total };
  }

  async findOne(id: number): Promise<Activity> {
    const activity = await this.activitiesRepository.findOne({ 
      where: { id }, 
      relations: ['user'] 
    });
    
    if (!activity) {
      throw new NotFoundException(`Activity with ID ${id} not found`);
    }
    return activity;
  }

  async create(activity: Partial<Activity>): Promise<Activity> {
    if (!activity.userId) {
      throw new BadRequestException('User ID is required');
    }

    const newActivity = this.activitiesRepository.create(activity);
    return this.activitiesRepository.save(newActivity);
  }

  async update(id: number, updateData: Partial<Activity>): Promise<Activity> {
    const activity = await this.findOne(id);
    
    Object.assign(activity, updateData);
    return this.activitiesRepository.save(activity);
  }

  async remove(id: number): Promise<void> {
    const activity = await this.findOne(id);
    await this.activitiesRepository.remove(activity);
  }

  async findByUser(userId: number): Promise<Activity[]> {
    return this.activitiesRepository.find({
      where: { userId },
      relations: ['user'],
      order: { createdAt: 'DESC' }
    });
  }

  async getTotalActivityStats(): Promise<{ totalActivities: number, totalUsers: number }> {
    const totalActivities = await this.activitiesRepository.count();
    const totalUsers = await this.activitiesRepository
      .createQueryBuilder('activity')
      .select('COUNT(DISTINCT activity.userId)', 'count')
      .getRawOne();

    return {
      totalActivities,
      totalUsers: parseInt(totalUsers.count)
    };
  }
}