import { ApiProperty } from '@nestjs/swagger';

export class FootprintResponseDto {
  @ApiProperty({ description: 'User ID' })
  userId: number;

  @ApiProperty({ description: 'Total carbon footprint in kg CO2' })
  totalFootprint: number;

  @ApiProperty({ description: 'Breakdown by category' })
  breakdown: {
    transport: number;
    energy: number;
    waste: number;
    food: number;
  };

  @ApiProperty({ description: 'Calculation timestamp' })
  calculatedAt: Date;
}