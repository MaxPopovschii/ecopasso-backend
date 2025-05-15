import { Injectable, NotFoundException } from '@nestjs/common';
import { ActivitiesService } from '../activities/activities.service';
import { FootprintResponseDto } from './dto/footprint-response.dto';

@Injectable()
export class FootprintService {
  // CO2 emission factors (kg CO2 per unit)
  private readonly emissionFactors = {
    transport: {
      car: 0.12,      // per km
      bus: 0.08,      // per km
      train: 0.04,    // per km
      plane: 0.25     // per km
    },
    energy: {
      electricity: 0.5,  // per kWh
      gas: 2.3          // per m3
    },
    waste: {
      general: 0.5,     // per kg
      recycling: 0.1    // per kg
    },
    food: {
      meat: 13.3,       // per kg
      vegetarian: 3.8   // per kg
    }
  };

  constructor(private readonly activitiesService: ActivitiesService) {}

  async calculateFootprint(userId: number): Promise<FootprintResponseDto> {
    const activities = await this.activitiesService.findByUser(userId);

    if (!activities.length) {
      throw new NotFoundException(`No activities found for user ${userId}`);
    }

    const breakdown = {
      transport: 0,
      energy: 0,
      waste: 0,
      food: 0
    };

    // Calculate footprint for each activity type
    activities.forEach((activity: any) => {
      switch (activity.type) {
        case 'transport':
          breakdown.transport += this.calculateTransportEmissions(activity);
          break;
        case 'energy':
          breakdown.energy += this.calculateEnergyEmissions(activity);
          break;
        case 'waste':
          breakdown.waste += this.calculateWasteEmissions(activity);
          break;
        case 'food':
          breakdown.food += this.calculateFoodEmissions(activity);
          break;
      }
    });

    const totalFootprint = Object.values(breakdown).reduce((sum, value) => sum + value, 0);

    return {
      userId,
      totalFootprint,
      breakdown,
      calculatedAt: new Date()
    };
  }

  private calculateTransportEmissions(activity: any): number {
    const { subtype, distance } = activity.data;
    return (this.emissionFactors.transport[subtype] || 0) * distance;
  }

  private calculateEnergyEmissions(activity: any): number {
    const { subtype, amount } = activity.data;
    return (this.emissionFactors.energy[subtype] || 0) * amount;
  }

  private calculateWasteEmissions(activity: any): number {
    const { subtype, weight } = activity.data;
    return (this.emissionFactors.waste[subtype] || 0) * weight;
  }

  private calculateFoodEmissions(activity: any): number {
    const { subtype, amount } = activity.data;
    return (this.emissionFactors.food[subtype] || 0) * amount;
  }
}