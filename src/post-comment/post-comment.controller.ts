import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Req,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PostCommentService } from './post-comment.service';
import {
  CreatePostCommentSwagger,
  DeletePostCommentSwagger,
  GetPostCommentsSwagger,
} from './post-comment.swagger';
import { ApiTags } from '@nestjs/swagger';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { Request } from 'express';
import { BaseResponse } from 'src/common/response/dto';
import { PostService } from 'src/post/post.service';
import { AuthGuard } from 'src/auth/guards/jwt.auth.guard';

@Controller('post-comment')
@UseGuards(AuthGuard)
@ApiTags('[서비스] 게시글 댓글')
export class PostCommentController {
  constructor(
    private readonly postCommentService: PostCommentService,
    private readonly postService: PostService,
  ) {}

  @Post()
  @CreatePostCommentSwagger('게시글 댓글 생성 API')
  async createPostComment(
    @Query('postId') postId: number,
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: Request,
  ): Promise<BaseResponse<any>> {
    const currentUserId = req.user.userId;

    await this.postService.validatePost(postId);

    const postComment = await this.postCommentService.createPostComment(
      postId,
      currentUserId,
      createCommentDto,
    );

    return new BaseResponse(true, '댓글 작성 성공', postComment);
  }

  @Get()
  @GetPostCommentsSwagger('게시글 댓글 리스트 조회 API')
  getPostCommenst() {
    // return this.userService.getHello();
  }

  @Patch()
  @DeletePostCommentSwagger('게시글 댓글 삭제 API')
  deletePostComment() {
    // return this.userService.getHello();
  }
}
