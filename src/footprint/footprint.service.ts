import { Injectable, NotFoundException } from '@nestjs/common';
import { ActivitiesService } from '../activities/activities.service';
import { FootprintResponseDto } from './dto/footprint-response.dto';
import { FootprintStatsDto } from './dto/footprint-stats.dto';
import { ActivityData } from 'src/activities/entities/activity-data.entity';

@Injectable()
export class FootprintService {
  constructor(private readonly activitiesService: ActivitiesService) { }

  async calculateFootprint(email: string): Promise<FootprintResponseDto> {
    const activities = await this.activitiesService.findByUser(email);

    if (!activities.length) {
      throw new NotFoundException(`No activities found for user ${email}`);
    }

    const breakdown = {
      food: 0,
      energy: 0,
      waste: 0,
      transport: 0
    };

    for (const activity of activities) {
      const category = this.mapCategory(
        activity.activityType.category?.name,
        activity.activityType.name
      );
      const emissionFactor = Number(activity.activityType.emission_factor);
      const quantity = this.extractQuantity(activity);

      if (
        breakdown[category] !== undefined &&
        !isNaN(emissionFactor)
      ) {
        breakdown[category] += emissionFactor * quantity;
      }
    }

    const totalFootprint = Object.values(breakdown).reduce((sum, value) => sum + value, 0);

    return {
      email,
      totalFootprint,
      breakdown,
      calculatedAt: new Date()
    };
  }

  private mapCategory(category: string, nome: string): string {
    if (category === 'alimentazione') return 'food';
    if (category === 'casa' && (nome === 'riciclo' || nome === 'Riciclo')) return 'waste';
    if (category === 'casa') return 'energy';
    if (category === 'trasporti') return 'transport';
    return category;
  }

  private extractQuantity(activity: any): number {
    let quantity = 1;
    const possibleFields = ['consumption', 'quantity', 'distance_km', 'quantity_kg'];
    for (const field of possibleFields) {
      const found: ActivityData | undefined = activity.data?.find((d: ActivityData) => d.field_name === field);
      if (found) {
        quantity = Number(found.field_value) || 1;
        break;
      }
    }
    return quantity;
  }

  // *** Nuovo metodo per estrarre la data corretta dall'activity data ***
  private extractDate(activity: any): Date {
    const possibleDateFields = ['consumption_date', 'data', 'data_viaggio', 'data_acquisto'];
    for (const field of possibleDateFields) {
      const found: ActivityData | undefined = activity.data?.find((d: ActivityData) => d.field_name === field);
      if (found) {
        const parsedDate = new Date(found.field_value);
        if (!isNaN(parsedDate.getTime())) {
          return parsedDate;
        }
      }
    }
    // Fallback: usa la data principale di activity
    return new Date(activity.date);
  }

  async getFootprintStats(email: string): Promise<FootprintStatsDto> {
    const activities = await this.activitiesService.findByUser(email);
    if (!activities.length) {
      return {
        monthly: new Array(12).fill(0),
        yearly: new Array(5).fill(0),
      };
    }

    const now = new Date();
    const currentYear = now.getFullYear();
    const monthly = new Array(12).fill(0);
    const yearlyMap: Record<number, number> = {};

    for (const activity of activities) {
      // Usa la data estratta da ActivityData (consumption_date o simili)
      const createdAt = this.extractDate(activity);
      const year = createdAt.getFullYear();
      const month = createdAt.getMonth();

      const emissionFactor = Number(activity.activityType.emission_factor);
      const quantity = this.extractQuantity(activity);
      const emission = emissionFactor * quantity;

      if (year === currentYear) {
        monthly[month] += emission;
      }

      yearlyMap[year] = (yearlyMap[year] || 0) + emission;
    }

    const lastFiveYears = Array.from({ length: 5 }, (_, i) => currentYear - 4 + i);
    const yearly = lastFiveYears.map(y => yearlyMap[y] || 0);

    return { monthly, yearly };
  }
}
