import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, 
  CreateDateColumn,
  JoinColumn
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ActivityType } from './activity-type.entity';

@Entity('attivita')
export class Activity {
  @PrimaryGeneratedColumn({ name: 'id_attivita' })
  id: number;

  @Column({ name: 'email_utente' })
  userEmail: string;

  @Column({ name: 'id_tipo_attivita' })
  activityTypeId: number;

  @Column({ type: 'text', nullable: true })
  note: string;

  @CreateDateColumn({ name: 'data_inserimento' })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.activities)
  @JoinColumn({ name: 'email_utente' })
  user: User;

  @ManyToOne(() => ActivityType)
  @JoinColumn({ name: 'id_tipo_attivita' })
  activityType: ActivityType;
}
