import {
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { PostLikeService } from './post-like.service';
import {
  CreatePostLikeSwagger,
  GetPostLikesSwagger,
} from './post-like.swagger';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PostLikeResponseDto } from './dtos/post-like.response';
import { BaseResponse } from 'src/common/response/dto';
import { GetPostLikesResponseDto } from './dtos/get-post-like.response.dto';
import { AuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { Request } from 'express';
import { PostService } from 'src/post/post.service';
import { DataNotFoundException } from 'src/common/exception/service.exception';

@ApiBearerAuth('Authorization')
@Controller('post-like')
@UseGuards(AuthGuard)
@ApiTags('[서비스] 게시글 좋아요')
export class PostLikeController {
  constructor(
    private readonly postLikeService: PostLikeService,
    private readonly postService: PostService,
  ) {}

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
  @Get(':postId')
  @GetPostLikesSwagger('게시글 좋아요 리스트 조회 API')
  async getPostLikes(
    @Param('postId') postId: number,
    @Query('page') page: number,
    @Query('take') take: number,
  ): Promise<BaseResponse<GetPostLikesResponseDto>> {
    const postData = await this.postService.getPostById(postId);
    if (!postData) {
      throw DataNotFoundException('게시글이 존재하지 않습니다.');
    }

    const likesData = await this.postLikeService.getPostLikes(postId, {
      page,
      take,
    });

    return new BaseResponse<GetPostLikesResponseDto>(
      true,
      'SUCCESS',
      likesData,
    );
  }

  @Post(':postId')
  @CreatePostLikeSwagger('게시글 좋아요 생성 및 삭제 API')
  async togglePostLike(
    @Param('postId') postId: number,
    @Req() req: Request,
  ): Promise<BaseResponse<PostLikeResponseDto>> {
    const userId = req.user.id;
    const postLikeResponse = await this.postLikeService.toggleLike(
      postId,
      userId,
    );

    return new BaseResponse<PostLikeResponseDto>(
      true,
      'SUCCESS',
      postLikeResponse,
    );
  }
}
