import { Test, TestingModule } from '@nestjs/testing';
import { CrobJobService } from './crob-job.service';

describe('CrobJobService', () => {
  let service: CrobJobService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CrobJobService],
    }).compile();

    service = module.get<CrobJobService>(CrobJobService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
