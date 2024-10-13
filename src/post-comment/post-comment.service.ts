import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostComment } from 'src/common/entities/post-comment.entity';
import { Post } from 'src/common/entities/post.entity';
import { User } from 'src/common/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { DataNotFoundException } from 'src/common/exception/service.exception';

@Injectable()
export class PostCommentService {
  constructor(
    @InjectRepository(PostComment)
    private readonly postCommentRepository: Repository<PostComment>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createPostComment(
    postId: number,
    currentUserId: number,
    createCommentDto: CreateCommentDto,
  ): Promise<PostComment> {
    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw DataNotFoundException('게시글을 찾을 수 없습니다.');
    }

    const user = await this.userRepository.findOne({ where: { id: currentUserId } });

    const postComment = this.postCommentRepository.create({
      content: createCommentDto.content,
      post,
      user,
    });

    return await this.postCommentRepository.save(postComment);
  }
}
