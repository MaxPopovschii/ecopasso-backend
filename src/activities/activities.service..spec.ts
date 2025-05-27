import { Test, TestingModule } from '@nestjs/testing';
import { ActivitiesService } from './activities.service';

describe('ActivitiesService', () => {
  let service: ActivitiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ActivitiesService],
    }).compile();

    service = module.get<ActivitiesService>(ActivitiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an activity', async () => {
    const activity = await service.create({
      userEmail: 'test@eco.com',
      activityTypeId: 1,
      note: 'Test',
      data: [{ field_name: 'distance_km', field_value: '2' }],
    });
    expect(activity).toHaveProperty('id');
    expect(activity.user).toBe('test@eco.com');
  });

  it('should throw if activityTypeId is missing', async () => {
    await expect(
      service.create({
        userEmail: 'test@eco.com',
        activityTypeId: undefined as any,
        note: 'Test',
        data: [],
      }),
    ).rejects.toThrow();
  });
});