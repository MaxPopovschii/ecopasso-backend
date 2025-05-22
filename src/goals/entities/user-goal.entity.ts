import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('user_goals')
export class UserGoal {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_email' })
  user: User;

  @Column('decimal', { precision: 10, scale: 2 })
  target_footprint: number;

  @Column()
  period: string; 

  @Column()
  start_date: Date;

  @Column()
  end_date: Date;

  @Column({ default: false })
  achieved: boolean;
}