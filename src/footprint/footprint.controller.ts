import { Controller, Get, Param } from '@nestjs/common';
import { FootprintService } from './footprint.service';

@Controller('footprint')
export class FootprintController {
  constructor(private readonly footprintService: FootprintService) {}

  @Get(':userId')
  getUserFootprint(@Param('userId') userId: string) {
    return this.footprintService.calculateFootprint(+userId);
  }
}