import { Body, Controller, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { PostService } from './post.service';
import { GetPostsResponse } from './dtos/total-postsResponse.dto';
import {
  GetMyPostsResponse,
  GetOtherPostsResponse,
} from './dtos/user-postsResponse.dto';
import {
  CreatePostsSwagger,
  GetPostsSwagger,
  GetPostSwagger,
  PatchIsRepresentativeSwagger,
  PatchPostSwagger,
} from './post.swagger';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { CreatePostDto } from './dtos/create-post.dto';
import { Request } from 'express';
import { BaseResponse } from 'src/common/response/dto';
import { PatchPostDto } from './dtos/patch-Post.dto';

@Controller('post')
@ApiTags('[서비스] 게시글')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get(':userId?')
  @GetPostsSwagger('게시글 리스트 조회 API')
  @ApiParam({ name: 'userId', required: false, description: 'User ID' })
  async getPosts(
    //@Req() req: Request,
    @Param('userId') userId?: number,
  ): Promise<
    BaseResponse<GetPostsResponse | GetMyPostsResponse | GetOtherPostsResponse>
  > {
    //const currentUserId = req.user.userId;
    const currentUserId = 1;

    const postsResponse = await this.postService.getPosts(
      userId,
      currentUserId,
    );

    return new BaseResponse(true, 'SUCCESS', postsResponse);
  }

  @Get()
  @GetPostSwagger('게시글 상세 조회 API')
  getPost() {
    // return this.userService.getHello();
  }

  @Post()
  @CreatePostsSwagger('게시글 생성 API')
  async createPost(
    @Body() createPostDto: CreatePostDto,
    @Req() req: Request,
  ): Promise<BaseResponse<any>> {
    //const userId = req.user.userId;
    const userId = 1;

    const post = await this.postService.createPost(createPostDto, userId);

    return new BaseResponse(true, 'SUCCESS', post);
  }

  @Patch(':postId')
  @PatchPostSwagger('게시글 수정 API')
  async patchPost(
    @Param('postId') postId: number,
    @Body() patchPostDto: PatchPostDto,
    @Req() req: Request,
  ): Promise<BaseResponse<any>> {
    //const userId = req.user.userId;
    const userId = 1;

    const updatedPost = await this.postService.patchPost(
      postId,
      patchPostDto,
      userId,
    );

    return new BaseResponse(true, 'SUCCESS', updatedPost);
  }

  @Patch()
  @PatchIsRepresentativeSwagger('대표 게시글 지정 API')
  patchIsRepresentative() {
    // return this.userService.getHello();
  }
}
