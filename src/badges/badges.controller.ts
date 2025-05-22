import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BadgesService } from './badges.service';
import { CreateBadgeDto } from './dto/create-badge.dto';
import { UpdateBadgeDto } from './dto/update-badge.dto';

@Controller('badges')
export class BadgesController {
  constructor(private readonly badgesService: BadgesService) {}

  @Get('user/:email')
  async getUserBadges(@Param('email') email: string) {
    return this.badgesService.findByUser(email);
  }

  @Post('assign')
  async assignBadge(
    @Body() body: { email: string; badgeName: string }
  ) {
    return this.badgesService.assignBadge(body.email, body.badgeName);
  }
}
