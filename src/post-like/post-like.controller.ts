import { Controller, Get, Param, Post, Req } from '@nestjs/common';
import { PostLikeService } from './post-like.service';
import {
  CreatePostLikeSwagger,
  GetPostLikesSwagger,
} from './post-like.swagger';
import { ApiTags } from '@nestjs/swagger';
import { PostLikeResponseDto } from './dtos/post-like.response';
import { BaseResponse } from 'src/common/response/dto';
import { GetPostLikesResponseDto } from './dtos/get-post-like.response.dto';

@Controller('post-like')
@ApiTags('[서비스] 게시글 좋아요')
export class PostLikeController {
  constructor(private readonly postLikeService: PostLikeService) {}

  @Get()
  @GetPostLikesSwagger('게시글 좋아요 리스트 조회 API')
  async getPostLikes(@Req() req: Request): Promise<BaseResponse<GetPostLikesResponseDto>> {
    const userId = 1; // 추후 수정
    const likesData = await this.postLikeService.getUserLikes(userId);

    return new BaseResponse<GetPostLikesResponseDto>(true, 'SUCCESS', likesData);
  }

  @Post(":postId")
  @CreatePostLikeSwagger('게시글 좋아요 생성 및 삭제 API') 
  async togglePostLike(
    @Param('postId') postId: number,
    @Req() req: Request
  ): Promise<BaseResponse<PostLikeResponseDto>> {
    const userId = 1; // 추후 수정
    const postLikeResponse = await this.postLikeService.toggleLike(postId, userId);

    return new BaseResponse<PostLikeResponseDto>(true, 'SUCCESS', postLikeResponse);
  }
}
