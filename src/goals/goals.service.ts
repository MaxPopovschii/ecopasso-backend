import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserGoal } from './entities/user-goal.entity';
import { ActivitiesService } from '../activities/activities.service';
import { CreateGoalDto } from './dto/create-goal.dto';

@Injectable()
export class GoalsService {
  constructor(
    @InjectRepository(UserGoal)
    private readonly goalRepo: Repository<UserGoal>,
    private readonly activitiesService: ActivitiesService
  ) {}

  async createGoal(createGoalDto: CreateGoalDto) {
    const goal = this.goalRepo.create({
      title: createGoalDto.title,
      description: createGoalDto.description,
      target_footprint: createGoalDto.target_footprint,
      start_date: new Date(),
      end_date: createGoalDto.end_date,
      user: { email: createGoalDto.userEmail },
      achieved: false
    });

    return this.goalRepo.save(goal);
  }

  async findByUser(userEmail: string) {
    return this.goalRepo.find({
      where: { user: { email: userEmail } },
      relations: ['activityType']
    });
  }

  async getProgress(email: string) {
    const goals = await this.goalRepo.find({
      where: { user: { email } },
      relations: ['activityType', 'user']
    });

    if (goals.length === 0) {
      throw new NotFoundException('No goals found for this user');
    }

    const progressArray = await Promise.all(
      goals.map(async (goal) => {
        // Trova tutte le attività dell'utente per questo tipo e periodo
        const activities = await this.activitiesService.findByUserAndType(
          email,
          goal.start_date,
          goal.end_date
        );

        // Calcola il footprint totale per questo obiettivo
        let totalFootprint = 0;
        for (const activity of activities) {
          const emissionFactor = Number(activity.activityType.emission_factor) || 0;
          let quantity = 1;

          // Cerca il valore di quantità/distanza/consumo nei dati dell'attività
          const possibleFields = ['consumption', 'quantity', 'distance_km', 'quantity_kg'];
          for (const field of possibleFields) {
            const found = activity.data.find(d => d.field_name === field);
            if (found) {
              quantity = Number(found.field_value) || 1;
              break;
            }
          }

          totalFootprint += emissionFactor * quantity;
        }

        // Calcola la percentuale di progresso
        const progressPercentage = (totalFootprint / goal.target_footprint) * 100;
        const achieved = totalFootprint >= goal.target_footprint;

        // Se l'obiettivo è stato raggiunto ma non era ancora segnato come tale
        if (achieved && !goal.achieved) {
          await this.goalRepo.update(goal.id, { achieved: true });
        }

        // Calcola i giorni rimanenti
        const now = new Date();
        const daysLeft = Math.max(0, Math.ceil(
          (goal.end_date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        ));

        return {
          id: goal.id,
          title: goal.title,
          description: goal.description,
          targetFootprint: goal.target_footprint,
          currentFootprint: totalFootprint,
          progressPercentage: Math.min(100, progressPercentage),
          achieved,
          daysLeft,
          startDate: goal.start_date,
          endDate: goal.end_date,
        };
      })
    );

    return progressArray.sort((a, b) => {
      // Prima gli obiettivi non raggiunti
      if (a.achieved !== b.achieved) {
        return a.achieved ? 1 : -1;
      }
      // Poi per scadenza più vicina
      return a.daysLeft - b.daysLeft;
    });
  }

}
