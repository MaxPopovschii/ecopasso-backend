import { 
  Controller, 
  Get, 
  Param, 
  ParseIntPipe,
  HttpStatus,
  NotFoundException
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { FootprintService } from './footprint.service';
import { FootprintResponseDto } from './dto/footprint-response.dto'

@ApiTags('Carbon Footprint')
@Controller('footprint')
export class FootprintController {
  constructor(private readonly footprintService: FootprintService) {}

  @Get(':userId')
  @ApiOperation({ summary: 'Calculate user carbon footprint' })
  @ApiParam({ name: 'userId', type: Number, description: 'User ID' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Returns user carbon footprint',
    type: FootprintResponseDto 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'User not found' 
  })
  async getUserFootprint(
    @Param('userId', ParseIntPipe) userId: number
  ): Promise<FootprintResponseDto> {
    const footprint = await this.footprintService.calculateFootprint(userId);
    
    if (!footprint) {
      throw new NotFoundException(`Footprint for user ${userId} not found`);
    }
    
    return {
      userId,
      totalFootprint: footprint.co2,
      breakdown: (footprint as any).breakdown ?? {},
      calculatedAt: (footprint as any).calculatedAt ?? new Date(),
    };
  }
}