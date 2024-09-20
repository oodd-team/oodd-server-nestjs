import { Test, TestingModule } from '@nestjs/testing';
import { StyletagController } from './styletag.controller';

describe('StyletagController', () => {
  let controller: StyletagController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StyletagController],
    }).compile();

    controller = module.get<StyletagController>(StyletagController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
