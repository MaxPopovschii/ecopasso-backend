import { Entity, Column, OneToMany, PrimaryColumn, CreateDateColumn } from 'typeorm';
import { Activity } from '../../activities/entities/activity.entity';

@Entity('utenti')
export class User {
  @PrimaryColumn()
  email: string;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column()
  password: string;

  @CreateDateColumn({ name: 'registration_date' })
  registrationDate: Date;

  @Column({ name: 'last_access', nullable: true })
  lastAccess: Date;

  @OneToMany(() => Activity, (activity) => activity.user)
  activities: Activity[];
}
