import { Test, TestingModule } from '@nestjs/testing';
import { InfraService } from './infra.service';

describe('InfraService', () => {
  let service: InfraService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InfraService],
    }).compile();

    service = module.get<InfraService>(InfraService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
