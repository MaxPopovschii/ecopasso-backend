import { Injectable } from '@nestjs/common';
import { ActivitiesService } from '../activities/activities.service';

@Injectable()
export class FootprintService {
  constructor(private readonly activitiesService: ActivitiesService) {}

  // Esempio: somma 'n' valori dalle attività, poi applica una formula
  async calculateFootprint(userId: number): Promise<{ co2: number }> {
    const activities = await this.activitiesService.findAll();
    // Logica custom: qui solo esempio
    const co2 = activities
      .filter((a) => a.user && a.user.id === userId)
      .reduce((sum, activity) => sum + (activity['co2Value'] ?? 0), 0);

    return { co2 };
  }
}