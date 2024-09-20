import { Test, TestingModule } from '@nestjs/testing';
import { StyletagService } from './styletag.service';

describe('StyletagService', () => {
  let service: StyletagService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StyletagService],
    }).compile();

    service = module.get<StyletagService>(StyletagService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
