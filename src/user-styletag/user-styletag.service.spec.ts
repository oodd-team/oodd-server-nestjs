import { Test, TestingModule } from '@nestjs/testing';
import { UserStyletagService } from './user-styletag.service';

describe('UserStyletagService', () => {
  let service: UserStyletagService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserStyletagService],
    }).compile();

    service = module.get<UserStyletagService>(UserStyletagService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
