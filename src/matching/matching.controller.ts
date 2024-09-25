import { Controller, Get, Patch, Post } from '@nestjs/common';
import { MatchingService } from './matching.service';
import {
  CreateMatchingSwagger,
  DeleteMatchingSwagger,
  GetMatchingsSwagger,
  GetMatchingSwagger,
  PatchMatchingRequestStatusSwagger,
} from './matching.swagger';

@Controller('matching')
export class MatchingController {
  constructor(private readonly matchingService: MatchingService) {}

  @Post()
  @CreateMatchingSwagger('매칭 생성 API')
  createMatching() {
    // return this.userService.getHello();
  }

  @Patch()
  @PatchMatchingRequestStatusSwagger('매칭 요청 수락 및 거절 API')
  patchMatchingRequestStatus() {
    // return this.userService.getHello();
  }

  @Patch()
  @DeleteMatchingSwagger('매칭 삭제 API')
  deleteMatching() {
    // return this.userService.getHello()
  }

  @Get()
  @GetMatchingsSwagger('매칭 리스트 조회 API')
  getMatchings() {
    // return this.userService.getHello()
  }

  @Get()
  @GetMatchingSwagger('매칭 상세 조회 API')
  getMatching() {
    // return this.userService.getHello()
  }
}
