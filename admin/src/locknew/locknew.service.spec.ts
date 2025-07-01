import { Test, TestingModule } from '@nestjs/testing';
import { LocknewService } from './locknew.service';

describe('LocknewService', () => {
  let service: LocknewService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LocknewService],
    }).compile();

    service = module.get<LocknewService>(LocknewService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
