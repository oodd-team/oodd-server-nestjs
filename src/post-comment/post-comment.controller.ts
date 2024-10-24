import { Controller, Post, Get, Patch, Param, Body, Req } from '@nestjs/common';
import { PostCommentService } from './post-comment.service';
import {
  CreatePostCommentSwagger,
  DeletePostCommentSwagger,
  GetPostCommentsSwagger,
} from './post-comment.swagger';
import { ApiTags } from '@nestjs/swagger';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { PostComment } from 'src/common/entities/post-comment.entity';
import { Request } from 'express';
import { BaseResponse } from 'src/common/response/dto';

@Controller('post-comment')
@ApiTags('[서비스] 게시글 댓글')
export class PostCommentController {
  constructor(private readonly postCommentService: PostCommentService) {}

  @Post()
  @CreatePostCommentSwagger('게시글 댓글 생성 API')
  async createPostComment(
    @Param('postId') postId: number,
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: Request,
  ): Promise<BaseResponse<PostComment>> {
    //const userId = req.user.userId;
    const userId = 1;

    const postComment = await this.postCommentService.createPostComment(
      postId,
      userId,
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
