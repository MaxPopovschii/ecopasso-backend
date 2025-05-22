import { Injectable } from '@nestjs/common';
import { ActivitiesService } from '../activities/activities.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class LeaderboardService {
  constructor(
    private readonly activitiesService: ActivitiesService,
    private readonly usersService: UsersService,
  ) {}

  async getTopUsers(limit = 10) {
    const users = await this.usersService.findAll();
    const results: { email: string; totalFootprint: number }[] = [];

    for (const user of users) {
      const activities = await this.activitiesService.findByUser(user.email);
      let total = 0;
      for (const activity of activities) {
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
      results.push({ email: user.email, totalFootprint: total });
    }

    // Ordina dal più green (meno CO2) al meno green
    return results.toSorted((a, b) => a.totalFootprint - b.totalFootprint).slice(0, limit);
  }
}
