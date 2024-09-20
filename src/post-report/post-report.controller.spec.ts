import { Test, TestingModule } from '@nestjs/testing';
import { PostReportController } from './post-report.controller';

describe('PostReportController', () => {
  let controller: PostReportController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostReportController],
    }).compile();

    controller = module.get<PostReportController>(PostReportController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
