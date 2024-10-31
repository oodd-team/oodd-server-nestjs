import {
  Controller,
  Get,
  Patch,
  Post,
  Query,
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
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { BaseResponse } from 'src/common/response/dto';
import { AuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { Request } from 'express';
import { PageOptionsDto } from './dtos/page-options.dto';
import { PageDto } from './dtos/page.dto';

@Controller('post')
@UseGuards(AuthGuard)
@ApiTags('[서비스] 게시글')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get('/')
  @GetPostsSwagger('게시글 리스트 조회 API')
  @ApiQuery({
    name: 'userId',
    required: false,
    description: 'User ID',
    type: Number,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: '페이지 번호',
    type: Number,
  })
  @ApiQuery({
    name: 'take',
    required: false,
    description: '한 페이지에 불러올 데이터 개수',
  })
  async getPosts(
    @Req() req: Request,
    @Query() pageOptionsDto?: PageOptionsDto,
    @Query('userId') userId?: number,
  ): Promise<
    BaseResponse<
      PageDto<GetPostsResponse | GetMyPostsResponse | GetOtherPostsResponse>
    >
  > {
    const currentUserId = req.user.userId;

    const options = pageOptionsDto
      ? {
          ...new PageOptionsDto(),
          ...pageOptionsDto, // Dto에 전달된 기본값
        }
      : new PageOptionsDto();

    const postsResponse = await this.postService.getPosts(
      options,
      userId,
      currentUserId,
    );

    return new BaseResponse(true, '게시글 리스트 조회 성공', postsResponse);
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
