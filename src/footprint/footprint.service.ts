import { Injectable, NotFoundException } from '@nestjs/common';
import { ActivitiesService } from '../activities/activities.service';
import { FootprintResponseDto } from './dto/footprint-response.dto';

@Injectable()
export class FootprintService {
  private readonly emissionFactors = {
    food: {
      vegetariano: 3.8,
      locale: 1.5,
      riutilizzo: 0.5
    },
    energy: {
      energia: 0.5,
      acqua: 0.2
    },
    waste: {
      riciclo: 0.1
    },
    transport: {
      bicicletta: 0,
      mezzi_pubblici: 0.08,
      auto_elettrica: 0.05
    }
  };

  constructor(private readonly activitiesService: ActivitiesService) {}

  async calculateFootprint(email: string): Promise<FootprintResponseDto> {
    const activities = await this.activitiesService.findByUser(email);

    if (!activities.length) {
      throw new NotFoundException(`No activities found for user ${email}`);
    }

    // Breakdown con chiavi inglesi
    const breakdown = {
      food: 0,
      energy: 0,
      waste: 0,
      transport: 0
    };

    for (const activity of activities) {
      let category: string = activity.activityType.categoria; // 'alimentazione', 'casa', 'trasporti'
      const nome = activity.activityType.nome;
      // Se non hai quantity, usa sempre 1
      const quantity = (activity as any).quantity ?? 1;

      // Mappa le categorie italiane a quelle inglesi
      if (category === 'alimentazione') category = 'food';
      else if (category === 'casa' && nome === 'riciclo') category = 'waste';
      else if (category === 'casa') category = 'energy';
      else if (category === 'trasporti') category = 'transport';

      if (
        this.emissionFactors[category] &&
        this.emissionFactors[category][nome] !== undefined
      ) {
        breakdown[category] += this.emissionFactors[category][nome] * quantity;
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
}