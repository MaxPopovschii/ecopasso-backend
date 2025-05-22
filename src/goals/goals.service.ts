import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserGoal } from './entities/user-goal.entity';
import { ActivitiesService } from '../activities/activities.service';

@Injectable()
export class GoalsService {
  constructor(
    @InjectRepository(UserGoal)
    private readonly goalRepo: Repository<UserGoal>,
    private readonly activitiesService: ActivitiesService,
  ) {}

  async getProgress(email: string) {
    const goal = await this.goalRepo.findOne({ where: { user: { email }, achieved: false } });
    if (!goal) return { progress: 0, goal: null };

    // Calcola footprint nel periodo
    const activities = await this.activitiesService.findByUser(email);
    let total = 0;
    for (const activity of activities) {
      if (
        new Date(activity.date) >= new Date(goal.start_date) &&
        new Date(activity.date) <= new Date(goal.end_date)
      ) {
        const emissionFactor = Number(activity.activityType.emission_factor) || 0;
        let quantity = 1;
        const possibleFields = ['consumption', 'quantity', 'distance_km', 'quantity_kg'];
        for (const field of possibleFields) {
          const found = activity.data.find(d => d.field_name === field);
          if (found) {
            quantity = Number(found.field_value) || 1;
            break;
          }
        }
        total += emissionFactor * quantity;
      }
    }
    const progress = Math.min(1, total / goal.target_footprint);
    return { progress, goal, total };
  }
}
