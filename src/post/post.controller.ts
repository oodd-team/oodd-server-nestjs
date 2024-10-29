import {
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
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
import { BaseResponse } from 'src/common/response/dto';
import { AuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { Request } from 'express';

@Controller('post')
@UseGuards(AuthGuard)
@ApiTags('[서비스] 게시글')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get(':userId?')
  @GetPostsSwagger('게시글 리스트 조회 API')
  @ApiParam({ name: 'userId', required: false, description: 'User ID' })
  async getPosts(
    @Req() req: Request,
    @Param('userId') userId?: number,
  ): Promise<
    BaseResponse<GetPostsResponse | GetMyPostsResponse | GetOtherPostsResponse>
  > {
    const currentUserId = req.user.userId;

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
