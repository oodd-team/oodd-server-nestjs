import { Controller, Get, Patch, Post, Query } from '@nestjs/common';
import { PostService } from './post.service';
import { PostDto } from './dtos/response/postResponse.dto';
import {
  CreatePostsSwagger,
  GetPostsSwagger,
  GetPostSwagger,
  PatchIsRepresentativeSwagger,
  PatchPostSwagger,
} from './post.swagger';
import { ApiTags } from '@nestjs/swagger';

@Controller('post')
@ApiTags('[서비스] 게시글')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  @GetPostsSwagger('게시글 리스트 조회 API')
  async getPosts(@Query('userId') userId?: number): Promise<PostDto[]> {
    const posts = await this.postService.findAll(userId);
    return posts.map(post => ({
      id: post.id,
      content: post.content,
      isRepresentative: post.isRepresentative,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      deletedAt: post.deletedAt,
      images: post.postImages.map(image => ({
        id: image.id,
        url: image.url,
        orderNum: image.orderNum,
      })),
      user: {
        id: post.user.id,
        nickname: post.user.nickname,
        profilePictureUrl: post.user.profilePictureUrl,
      },
      likeCount: post.commentCount,
      commentCount: post.likeCount,
    }));
    }

  @Get()
  @GetPostSwagger('게시글 상세 조회 API')
  getPost() {
    // return this.userService.getHello();
  }

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
