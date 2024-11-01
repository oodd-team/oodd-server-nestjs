import { Controller, Get, Post } from '@nestjs/common';
import { PostLikeService } from './post-like.service';
import {
  CreatePostLikeSwagger,
  GetPostLikesSwagger,
} from './post-like.swagger';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('post-like')
@ApiTags('[서비스] 게시글 좋아요')
export class PostLikeController {
  constructor(private readonly postLikeService: PostLikeService) {}

  @Get()
  @GetPostLikesSwagger('게시글 좋아요 리스트 조회 API')
  getPostLikes() {
    // return this.userService.getHello();
  }

  @Post()
  @CreatePostLikeSwagger('게시글 좋아요 생성 및 삭제 API')
  createPostLike() {
    // return this.userService.getHello();
  }
}
