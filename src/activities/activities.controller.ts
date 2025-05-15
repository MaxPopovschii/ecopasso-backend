import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Delete, 
  Query, 
  ParseIntPipe,
  HttpStatus,
  HttpCode,
  Put
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ActivitiesService } from './activities.service';
import { Activity } from './entities/activity.entity';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';

@ApiTags('activities')
@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all activities with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns paginated activities' })
  async findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 10
  ) {
    return this.activitiesService.findAll(page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get activity by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Activity found' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Activity not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.activitiesService.findOne(id);
  }

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

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get activities by user ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns user activities' })
  async findByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.activitiesService.findByUser(userId);
  }

  @Get('stats/total')
  @ApiOperation({ summary: 'Get total activity statistics' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns activity statistics' })
  async getTotalStats() {
    return this.activitiesService.getTotalActivityStats();
  }
}