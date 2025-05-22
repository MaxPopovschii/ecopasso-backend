import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Delete, 
  ParseIntPipe,
  HttpStatus,
  HttpCode,
  Put
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ActivitiesService } from './activities.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';

@ApiTags('activities')
@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create new activity' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Activity created successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input' })
  async create(@Body() createActivityDto: CreateActivityDto) {
    return this.activitiesService.create(createActivityDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update activity' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Activity updated successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Activity not found' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateActivityDto: UpdateActivityDto
  ) {
    return this.activitiesService.update(id, updateActivityDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete activity' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Activity deleted successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Activity not found' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.activitiesService.remove(id);
  }

  @Get('user/:email')
  @ApiOperation({ summary: 'Get activities by user email' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns user activities' })
  async findByUser(@Param('email') email: string) {
    return this.activitiesService.findByUser(email);
  }

  @Get('category/:categoryId')
  @ApiOperation({ summary: 'Get activities by category' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns activities by category' })
  async findByCategory(@Param('categoryId', ParseIntPipe) categoryId: number) {
    return this.activitiesService.findByCategory(categoryId);
  }

  @Get('stats/total')
  @ApiOperation({ summary: 'Get total activity statistics' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns activity statistics' })
  async getTotalStats() {
    return this.activitiesService.getTotalActivityStats();
  }
}