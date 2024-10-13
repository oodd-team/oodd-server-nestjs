import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { GetPostsResponse } from './dtos/total-postsResponse.dto';
import { GetMyPostsResponse } from './dtos/user-postsResponse.dto';
import {
  CreatePostsSwagger,
  GetPostsSwagger,
  GetPostSwagger,
  PatchIsRepresentativeSwagger,
  PatchPostSwagger,
} from './post.swagger';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreatePostDto } from './dtos/create-post.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtPayload, SocialUser } from 'src/auth/dto/auth.dto';
import { Request } from 'express';
import { BaseResponse } from 'src/common/response/dto';
import { AuthService } from 'src/auth/auth.service';
import { KakaoAuthGuard } from 'src/auth/guards/kakao.auth.guard';
import { PatchPostDto } from './dtos/patch-Post.dto';

@Controller('post')
@ApiTags('[서비스] 게시글')
export class PostController {
  constructor(private readonly postService: PostService) {}

  /*
  @Get()
  @GetPostsSwagger('게시글 리스트 조회 API')
  @ApiQuery({
    name: 'userId',
    required: false,
    type: Number,
    description: '사용자 ID (선택적)',
  })
  async getPosts(
    @Query('userId') userId?: number,
  ): Promise<{
    posts: (GetPostsResponse | GetMyPostsResponse)[];
    totalPostCount: number;
  }> {
    try {
      const posts = await this.postService.findAll(userId);
      const totalPostCount = posts.length;

      //user의 총 post 수, 총 like 수
      let userLikeCount = 0;
      let userPostCount = 0;
      if (userId) {
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
*/
  /*
  @Get()
  @GetPostSwagger('게시글 상세 조회 API')
  getPost() {
    // return this.userService.getHello();
  }*/

  @Post()
  @UseGuards(KakaoAuthGuard)
  @CreatePostsSwagger('게시글 생성 API')
  async createPost(
    @Body() createPostDto: CreatePostDto,
    @Req() req: Request,
  ): Promise<BaseResponse<any>> {
    const userId = req.user.userId;

    const post = await this.postService.createPost(createPostDto, userId);

    return new BaseResponse(true, 'SUCCESS', post);
  }

  @Patch(':postId')
  @UseGuards(KakaoAuthGuard)
  @PatchPostSwagger('게시글 수정 API')
  async patchPost(
    @Param('postId') postId: number,
    @Body() patchPostDto: PatchPostDto,
    @Req() req: Request,
  ): Promise<BaseResponse<any>> {
    const userId = req.user.userId;

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
