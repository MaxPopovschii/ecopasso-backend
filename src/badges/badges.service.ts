import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Badge } from './entities/badge.entity';
import { CreateBadgeDto } from './dto/create-badge.dto';
import { UpdateBadgeDto } from './dto/update-badge.dto';

@Injectable()
export class BadgesService {
  constructor(
    @InjectRepository(Badge)
    private readonly badgeRepo: Repository<Badge>,
  ) {}

  async findByUser(email: string): Promise<Badge[]> {
    return this.badgeRepo.find({ where: { user: { email } } });
  }

  async assignBadge(email: string, badgeName: string): Promise<Badge> {
    const badge = this.badgeRepo.create({ user: { email } as any, badge_name: badgeName });
    return this.badgeRepo.save(badge);
  }
}
