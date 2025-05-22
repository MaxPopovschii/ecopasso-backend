import { IsString, IsNotEmpty, IsNumber, IsOptional, ValidateNested, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class ActivityDataDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  field_name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  field_value: string;
}

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

  @ApiProperty({ type: [ActivityDataDto], required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ActivityDataDto)
  @IsOptional()
  data?: ActivityDataDto[];
}