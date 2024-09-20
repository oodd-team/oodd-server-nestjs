import { Test, TestingModule } from '@nestjs/testing';
import { PostStyletagController } from './post-styletag.controller';

describe('PostStyletagController', () => {
  let controller: PostStyletagController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostStyletagController],
    }).compile();

    controller = module.get<PostStyletagController>(PostStyletagController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
