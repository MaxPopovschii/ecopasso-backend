import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity } from './entities/activity.entity';
import { ActivityData } from './entities/activity-data.entity';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(Activity)
    private readonly activitiesRepository: Repository<Activity>,
    @InjectRepository(ActivityData)
    private readonly activityDataRepository: Repository<ActivityData>,
  ) {}

  async findAll(): Promise<Activity[]> {
    return this.activitiesRepository.find({
      relations: ['user', 'activityType', 'data'],
      order: { date: 'DESC' }
    });
  }

  async findOne(id: number): Promise<Activity> {
    const activity = await this.activitiesRepository.findOne({
      where: { id },
      relations: ['user', 'activityType', 'data']
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

    // Crea l'attività
    const activity = this.activitiesRepository.create({
      user: { email: createActivityDto.userEmail } as any,
      activityType: { id: createActivityDto.activityTypeId } as any,
      note: createActivityDto.note,
      data: createActivityDto.data?.map(d => this.activityDataRepository.create(d)) ?? [],
    });

    return this.activitiesRepository.save(activity);
  }

  async update(id: number, updateActivityDto: UpdateActivityDto): Promise<Activity> {
    const activity = await this.findOne(id);

    if (updateActivityDto.note !== undefined) {
      activity.note = updateActivityDto.note;
    }

    // Aggiorna i dati specifici se forniti
    if (updateActivityDto.data) {
      // Rimuovi i vecchi dati
      await this.activityDataRepository.delete({ activity: { id } });
      // Aggiungi i nuovi dati
      activity.data = updateActivityDto.data.map(d => this.activityDataRepository.create(d));
    }

    return this.activitiesRepository.save(activity);
  }

  async remove(id: number): Promise<void> {
    const activity = await this.findOne(id);
    await this.activitiesRepository.remove(activity);
  }

  async findByUser(email: string): Promise<Activity[]> {
    return this.activitiesRepository.find({
      where: { user: { email } },
      relations: ['user', 'activityType', 'data'],
      order: { date: 'DESC' }
    });
  }

  async findByCategory(categoryId: number): Promise<Activity[]> {
    return this.activitiesRepository
      .createQueryBuilder('activity')
      .leftJoinAndSelect('activity.activityType', 'activityType')
      .leftJoinAndSelect('activity.data', 'data')
      .where('activityType.category = :categoryId', { categoryId })
      .getMany();
  }

  async getTotalActivityStats(): Promise<{ totalActivities: number; totalUsers: number }> {
    const totalActivities = await this.activitiesRepository.count();
    const totalUsers = await this.activitiesRepository
      .createQueryBuilder('activity')
      .select('COUNT(DISTINCT activity.user)', 'count')
      .getRawOne();

    return {
      totalActivities,
      totalUsers: parseInt(totalUsers.count)
    };
  }
}