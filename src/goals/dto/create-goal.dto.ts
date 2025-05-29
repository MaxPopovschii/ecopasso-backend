import { IsNotEmpty, IsString, IsNumber, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGoalDto {
  @ApiProperty({ example: 'Ridurre emissioni CO2', description: 'Titolo dell\'obiettivo' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 'Voglio ridurre le emissioni usando la bici', description: 'Descrizione dettagliata' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 100, description: 'Valore target da raggiungere in kg di CO2' })
  @IsNumber()
  @IsNotEmpty()
  target_footprint: number;

  @ApiProperty({ example: 'user@email.com', description: 'Email dell\'utente' })
  @IsString()
  @IsNotEmpty()
  userEmail: string;

  @ApiProperty({ example: '2024-12-31', description: 'Data di scadenza' })
  @IsDateString()
  @IsNotEmpty()
  end_date: Date;
}