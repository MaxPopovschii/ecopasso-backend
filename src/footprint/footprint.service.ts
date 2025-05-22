import { Injectable, NotFoundException } from '@nestjs/common';
import { ActivitiesService } from '../activities/activities.service';
import { FootprintResponseDto } from './dto/footprint-response.dto';

@Injectable()
export class FootprintService {
  constructor(private readonly activitiesService: ActivitiesService) {}

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
      const found = activity.data?.find(d => d.field_name === field);
      if (found) {
        quantity = Number(found.field_value) || 1;
        break;
      }
    }
    return quantity;
  }
}