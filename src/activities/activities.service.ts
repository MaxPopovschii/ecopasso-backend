import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity } from './entities/activity.entity';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(Activity)
    private readonly activitiesRepository: Repository<Activity>,
  ) {}

  async findAll(page: number = 1, limit: number = 10): Promise<{activities: Activity[], total: number}> {
    const [activities, total] = await this.activitiesRepository.findAndCount({
      relations: ['user', 'activityType'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' }
    });

    return { activities, total };
  }

  async findOne(id: number): Promise<Activity> {
    const activity = await this.activitiesRepository.findOne({ 
      where: { id }, 
      relations: ['user', 'activityType'] 
    });
    
    if (!activity) {
      throw new NotFoundException(`Activity with ID ${id} not found`);
    }
    return activity;
  }

  async create(createActivityDto: CreateActivityDto): Promise<Activity> {
    if (!createActivityDto.userEmail) {
      throw new BadRequestException('User email is required');
    }

    if (!createActivityDto.activityTypeId) {
      throw new BadRequestException('Activity type is required');
    }

    const activity = this.activitiesRepository.create({
      userEmail: createActivityDto.userEmail,
      activityTypeId: createActivityDto.activityTypeId,
      note: createActivityDto.note
    });

    return this.activitiesRepository.save(activity);
  }

  async update(id: number, updateActivityDto: UpdateActivityDto): Promise<Activity> {
    const activity = await this.findOne(id);
    
    Object.assign(activity, updateActivityDto);
    return this.activitiesRepository.save(activity);
  }

  async remove(id: number): Promise<void> {
    const activity = await this.findOne(id);
    await this.activitiesRepository.remove(activity);
  }

  async findByUser(email: string): Promise<Activity[]> {
    return this.activitiesRepository.find({
      where: { userEmail: email },
      relations: ['user', 'activityType'],
      order: { createdAt: 'DESC' }
    });
  }

  async findByCategory(categoryId: number): Promise<Activity[]> {
    // Replace 'activityTypeId' with the correct property name if needed
    return await this.activitiesRepository.find({ where: { activityTypeId: categoryId } });
  }

  async getTotalActivityStats(): Promise<{ totalActivities: number, totalUsers: number }> {
    const totalActivities = await this.activitiesRepository.count();
    const totalUsers = await this.activitiesRepository
      .createQueryBuilder('activity')
      .select('COUNT(DISTINCT activity.userEmail)', 'count')
      .getRawOne();

    return {
      totalActivities,
      totalUsers: parseInt(totalUsers.count)
    };
  }
}