import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { ActivityCategory } from './activity-category.entity';
import { Activity } from './activity.entity';

@Entity('activity_types')
export class ActivityType {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ActivityCategory, (category) => category.types)
  @JoinColumn({ name: 'category_id' })
  category: ActivityCategory;

  @Column()
  name: string;

  @Column({ nullable: true })
  unit: string;

  @Column({ type: 'decimal', precision: 10, scale: 4, nullable: true })
  emission_factor: number;

  @OneToMany(() => Activity, (activity) => activity.activityType)
  activities: Activity[];
}