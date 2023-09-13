import { Test, TestingModule } from '@nestjs/testing';
import { ShoeService } from './shoe.service';

describe('ShoeService', () => {
  let service: ShoeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShoeService],
    }).compile();

    service = module.get<ShoeService>(ShoeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
