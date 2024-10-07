import { Controller, Get, InternalServerErrorException, Patch, Post, Query } from '@nestjs/common';
import { PostService } from './post.service';
import { AllPostsDto } from './dtos/response/all-postsResponse.dto';
import { UserPostsDto } from './dtos/response/user-postsResponse.dto';
import {
  CreatePostsSwagger,
  GetPostsSwagger,
  GetPostSwagger,
  PatchIsRepresentativeSwagger,
  PatchPostSwagger,
} from './post.swagger';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@Controller('post')
@ApiTags('[서비스] 게시글')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  @GetPostsSwagger('게시글 리스트 조회 API')
  @ApiQuery({ name: 'userId', required: false, type: Number, description: '사용자 ID (선택적)' })
  async getPosts(@Query('userId') userId?: number): Promise<{ posts: (AllPostsDto | UserPostsDto)[]; totalPostCount: number }> {
    try {
      const posts = await this.postService.findAll(userId);
      const totalPostCount = posts.length;
  
      //user의 총 post 수, 총 like 수
      let userLikeCount = 0;
      let userPostCount = 0;
      if(userId) {
        userLikeCount = await this.postService.UserLikeCount(userId);
        userPostCount = await this.postService.UserPostCount(userId);
      }

      return {
        posts,
        totalPostCount,
        ...(userId && { userLikeCount, userPostCount }),
      };
    } catch (error) {
      throw new InternalServerErrorException('서버에서 오류가 발생했습니다.');
    }
  }

/*
  @Get()
  @GetPostSwagger('게시글 상세 조회 API')
  getPost() {
    // return this.userService.getHello();
  }*/

  @Post()
  @CreatePostsSwagger('게시글 생성 API')
  createPost() {
    // return this.userService.getHello();
  }

  @Patch()
  @PatchPostSwagger('게시글 수정 API')
  patchPost() {
    // return this.userService.getHello();
  }

  @Patch()
  @PatchIsRepresentativeSwagger('대표 게시글 지정 API')
  patchIsRepresentative() {
    // return this.userService.getHello();
  }
}
