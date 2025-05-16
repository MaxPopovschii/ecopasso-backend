import { ApiProperty } from '@nestjs/swagger';

export class FootprintResponseDto {
  @ApiProperty({ description: 'User email' })
  email: string;

  @ApiProperty({ description: 'Total carbon footprint in kg CO2' })
  totalFootprint: number;

  @ApiProperty({ description: 'Breakdown by category' })
  breakdown: {
    food: number;
    energy: number;
    waste: number;
    transport: number;
  };

  @ApiProperty({ description: 'Calculation timestamp' })
  calculatedAt: Date;
}