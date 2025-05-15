import { Test, TestingModule } from '@nestjs/testing';
import { FootprintService } from './footprint.service';
import { ActivitiesService } from '../activities/activities.service';

describe('FootprintService', () => {
  let service: FootprintService;
  let activitiesService: ActivitiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FootprintService,
        {
          provide: ActivitiesService,
          useValue: {
            findByUser: jest.fn()
          }
        }
      ],
    }).compile();

    service = module.get<FootprintService>(FootprintService);
    activitiesService = module.get<ActivitiesService>(ActivitiesService);
  });

  it('should calculate footprint correctly', async () => {
    const mockActivities = [
      {
        id: 1,
        name: 'Car Transport',
        description: 'Driving a car',
        userId: 1,
        type: 'transport',
        data: { subtype: 'car', distance: 100 },
        createdAt: new Date(),
        updatedAt: new Date(),
        date: new Date(),
        footprint: 0,
        user: {
          id: 1,
          name: 'Test User',
          email: 'test@example.com',
          // Add other required User properties as needed
        },
        status: 'completed',
        ecoPoints: 0,
        completedAt: new Date()
      }
    ];

    jest.spyOn(activitiesService, 'findByUser').mockResolvedValue(mockActivities)

    const result = await service.calculateFootprint(1);
    expect(result.totalFootprint).toBeGreaterThan(0);
    expect(result.breakdown.transport).toBeGreaterThan(0);
  });
});