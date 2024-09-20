import { Test, TestingModule } from '@nestjs/testing';
import { PostStyletagService } from './post-styletag.service';

describe('PostStyletagService', () => {
  let service: PostStyletagService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostStyletagService],
    }).compile();

    service = module.get<PostStyletagService>(PostStyletagService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
