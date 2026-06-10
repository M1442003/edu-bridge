import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TimetablesService } from './timetables.service';
import { Timetable } from './timetable.entity';
import { User } from '../users/user.entity';
import { ClassEntity } from '../classes/class.entity';

describe('TimetablesService', () => {
  let service: TimetablesService;
  let timetableRepo: { create: jest.Mock; save: jest.Mock };

  beforeEach(async () => {
    timetableRepo = {
      create: jest.fn((entity) => entity),
      save: jest.fn(async (entity) => entity),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TimetablesService,
        {
          provide: getRepositoryToken(Timetable),
          useValue: timetableRepo,
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn().mockResolvedValue({ id: 100 }),
          },
        },
        {
          provide: getRepositoryToken(ClassEntity),
          useValue: {
            findOne: jest.fn().mockResolvedValue({ id: 1 }),
          },
        },
      ],
    }).compile();

    service = module.get<TimetablesService>(TimetablesService);
  });

  it('defaults venue to a non-empty string when the client omits it', async () => {
    await service.create({
      lecturerId: 100,
      classId: 1,
      dayOfWeek: 0,
      startTime: '07:30',
      endTime: '09:45',
    } as any);

    expect(timetableRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({ venue: 'TBD' }),
    );
    expect(timetableRepo.save).toHaveBeenCalledWith(
      expect.objectContaining({ venue: 'TBD' }),
    );
  });
});
