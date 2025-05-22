import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, 
  OneToMany, 
  JoinColumn, 
  CreateDateColumn 
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ActivityType } from './activity-type.entity';
import { ActivityData } from './activity-data.entity';

@Entity('activities')
export class Activity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.activities)
  @JoinColumn({ name: 'user_email' })
  user: User;

  @ManyToOne(() => ActivityType, (type) => type.activities)
  @JoinColumn({ name: 'activity_type_id' })
  activityType: ActivityType;

  @CreateDateColumn({ name: 'date' })
  date: Date;

  @Column({ nullable: true })
  note: string;

  @OneToMany(() => ActivityData, (data) => data.activity, { cascade: true })
  data: ActivityData[];
}
