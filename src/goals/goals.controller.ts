import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { GoalsService } from './goals.service';
import { CreateGoalDto } from './dto/create-goal.dto';

@Controller('goals')
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Get('progress/:email')
  async getUserGoalProgress(@Param('email') email: string) {
    return this.goalsService.getProgress(email);
  }

  @Post('create')
  async createGoal(@Body() createGoalDto: CreateGoalDto) {
    return this.goalsService.createGoal(createGoalDto);
  }  
}
