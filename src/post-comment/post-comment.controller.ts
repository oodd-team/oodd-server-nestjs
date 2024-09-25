import { Controller, Post, Get, Patch } from '@nestjs/common';
import { PostCommentService } from './post-comment.service';
import {
  CreatePostCommentSwagger,
  DeletePostCommentSwagger,
  GetPostCommentsSwagger,
} from './post-comment.swagger';

@Controller('post-comment')
export class PostCommentController {
  constructor(private readonly postCommentService: PostCommentService) {}

  @Post()
  @CreatePostCommentSwagger('게시글 댓글 생성 API')
  createPostComment() {
    // return this.userService.getHello();
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
