import { 
  Controller, 
  Get,  
  HttpStatus,
  NotFoundException,
  Query
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { FootprintService } from './footprint.service';
import { FootprintResponseDto } from './dto/footprint-response.dto'

@ApiTags('Carbon Footprint')
@Controller('footprint')
export class FootprintController {
  constructor(private readonly footprintService: FootprintService) {}

  @Get(':email')
  @ApiOperation({ summary: 'Calculate user carbon footprint' })
  @ApiQuery({ name: 'email', type: String, description: 'User email' })
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
    @Query('email') email: string
  ): Promise<FootprintResponseDto> {
    const footprint = await this.footprintService.calculateFootprint(email);
    
    if (!footprint) {
      throw new NotFoundException(`Footprint for user ${email} not found`);
    }
    
    return footprint;
  }
}