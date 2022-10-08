import { Test, TestingModule } from '@nestjs/testing';
import { InfraController } from './infra.controller';

describe('InfraController', () => {
  let controller: InfraController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InfraController],
    }).compile();

    controller = module.get<InfraController>(InfraController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
