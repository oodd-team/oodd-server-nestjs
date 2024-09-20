import { Test, TestingModule } from '@nestjs/testing';
import { PostClothingService } from './post-clothing.service';

describe('PostClothingService', () => {
  let service: PostClothingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostClothingService],
    }).compile();

    service = module.get<PostClothingService>(PostClothingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
