import { Test, TestingModule } from '@nestjs/testing';
import { PostClothingController } from './post-clothing.controller';

describe('PostClothingController', () => {
  let controller: PostClothingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostClothingController],
    }).compile();

    controller = module.get<PostClothingController>(PostClothingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
