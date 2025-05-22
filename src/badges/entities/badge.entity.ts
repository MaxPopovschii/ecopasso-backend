import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('user_badges')
export class Badge {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_email' })
  user: User;

  @Column()
  badge_name: string;

  @CreateDateColumn()
  achieved_at: Date;
}
