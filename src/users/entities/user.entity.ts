import { Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Activity } from '../../activities/entities/activity.entity';

@Entity('users')
export class User {
  @PrimaryColumn({unique : true})
  email: string;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column()
  password: string;

  @CreateDateColumn({ name: 'created_at' })
  registrationDate: Date;

  @Column({ name: 'last_access', nullable: true })
  lastAccess: Date;

  @OneToMany(() => Activity, (activity) => activity.user)
  activities: Activity[];
}
