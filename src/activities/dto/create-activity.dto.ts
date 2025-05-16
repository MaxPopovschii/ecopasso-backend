import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateActivityDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userEmail: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  activityTypeId: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  note?: string;
}