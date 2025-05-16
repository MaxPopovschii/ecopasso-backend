import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Activity } from './activity.entity';

export enum ActivityCategory {
  ALIMENTAZIONE = 'alimentazione',
  CASA = 'casa',
  TRASPORTI = 'trasporti'
}

@Entity('tipi_attivita')
export class ActivityType {
  @PrimaryGeneratedColumn({ name: 'id_tipo_attivita' })
  id: number;

  @Column()
  nome: string;

  @Column({ type: 'enum', enum: ActivityCategory })
  categoria: ActivityCategory;

  @Column({ name: 'unita_misura' })
  unitaMisura: string;

  @Column({ name: 'fattore_conversione', type: 'decimal', precision: 10, scale: 2 })
  fattoreConversione: number;

  @Column()
  punti: number;

  @OneToMany(() => Activity, (activity) => activity.activityType)
  activities: Activity[];
}