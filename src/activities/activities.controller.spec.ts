import { Test, TestingModule } from '@nestjs/testing';
import { ActivitiesController } from './activities.controller';
import { ActivitiesService } from './activities.service';

describe('ActivitiesController', () => {
  let controller: ActivitiesController;
  let service: ActivitiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActivitiesController],
      providers: [
        {
          provide: ActivitiesService,
          useValue: {
            create: jest.fn().mockResolvedValue({ id: 1, userEmail: 'test@eco.com' }),
            update: jest.fn().mockResolvedValue({ id: 1 }),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ActivitiesController>(ActivitiesController);
    service = module.get<ActivitiesService>(ActivitiesService);
  });

  it('should create an activity', async () => {
    const result = await controller.create({
      userEmail: 'test@eco.com',
      activityTypeId: 1,
      note: 'Test',
      data: [],
    });
    expect(result).toHaveProperty('id');
  });

  it('should update an activity', async () => {
    const result = await controller.update(1, { note: 'Updated' });
    expect(result).toHaveProperty('id');
  });

  it('should remove an activity', async () => {
    await expect(controller.remove(1)).resolves.toBeUndefined();
  });
});