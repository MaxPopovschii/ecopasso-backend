import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ActivityType } from './activity-type.entity';

@Entity('activity_categories')
export class ActivityCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => ActivityType, (type) => type.category)
  types: ActivityType[];
}