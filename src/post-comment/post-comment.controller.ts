import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Query,
  UseGuards,
  Delete,
  Param,
} from '@nestjs/common';
import { PostCommentService } from './post-comment.service';
import {
  CreatePostCommentSwagger,
  DeletePostCommentSwagger,
  GetPostCommentsSwagger,
} from './post-comment.swagger';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { Request } from 'express';
import { BaseResponse } from 'src/common/response/dto';
import { AuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PostComment } from 'src/common/entities/post-comment.entity';
import { GetCommentsDto } from './dtos/get-comment.dto';
import dayjs from 'dayjs';
import { UserBlockService } from 'src/user-block/user-block.service';

@ApiBearerAuth('Authorization')
@Controller('post-comment')
@UseGuards(AuthGuard)
@ApiTags('[서비스] 게시글 댓글')
export class PostCommentController {
  constructor(
    private readonly postCommentService: PostCommentService,
    private readonly userBlockService: UserBlockService,
  ) {}

  @Post()
  @CreatePostCommentSwagger('게시글 댓글 생성 API')
  async createPostComment(
    @Query('postId') postId: number,
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: Request,
  ): Promise<BaseResponse<any>> {
    const currentUserId = req.user.id;

    const postComment = await this.postCommentService.createPostComment(
      postId,
      currentUserId,
      createCommentDto,
    );

    return new BaseResponse(true, '댓글 작성 성공', postComment);
  }

  @Get()
  @GetPostCommentsSwagger('게시글 댓글 리스트 조회 API')
  async getPostComments(
    @Query('postId') postId: number,
    @Req() req: Request,
  ): Promise<BaseResponse<GetCommentsDto>> {
    const currentUserId = req.user.id;

    const blockedUserIds: number[] =
      await this.userBlockService.getBlockedUserIds(currentUserId);

    const comments = await this.postCommentService.getPostComments(
      postId,
      blockedUserIds,
    );

    const commenteResponse: GetCommentsDto = {
      comments: comments.map((comment) => ({
        id: comment.id,
        content: comment.content,
        createdAt: dayjs(comment.createdAt).format('YYYY-MM-DDTHH:mm:ssZ'),
        user: {
          id: comment.user.id,
          nickname: comment.user.nickname,
          profilePictureUrl: comment.user.profilePictureUrl,
        },
        isCommentWriter: comment.user.id == currentUserId,
      })),
      totalCount: comments.length,
    };

    return new BaseResponse(true, '댓글 목록 조회 성공', commenteResponse);
  }

  @Delete(':commentId')
  @DeletePostCommentSwagger('게시글 댓글 삭제 API')
  async deletePostComment(
    @Param('commentId')
    commentId: number,
    @Req() req: Request,
  ): Promise<BaseResponse<PostComment>> {
    const currentUserId = req.user.id;

    await this.postCommentService.validateUser(commentId, currentUserId);

    await this.postCommentService.deletePostComment(commentId);

    return new BaseResponse(true, '댓글 삭제 성공');
  }
}
