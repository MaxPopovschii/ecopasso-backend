import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ActivityType } from '../../activities/entities/activity-type.entity';

@Entity('user_goals')
export class UserGoal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_email' })
  user: User;

  @Column('decimal', { precision: 10, scale: 2 })
  target_footprint: number;

  @Column()
  start_date: Date;

  @Column()
  end_date: Date;

  @Column({ default: false })
  achieved: boolean;
}