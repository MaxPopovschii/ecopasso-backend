import { Controller, Get, Param } from '@nestjs/common';
import { GoalsService } from './goals.service';

@Controller('goals')
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Get('progress/:email')
  async getUserGoalProgress(@Param('email') email: string) {
    return this.goalsService.getProgress(email);
  }
}
