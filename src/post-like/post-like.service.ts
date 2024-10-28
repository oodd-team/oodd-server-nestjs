import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostLike } from '../common/entities/post-like.entity';
import { PostService } from '../post/post.service';
import { PostLikeResponseDto } from './dtos/post-like.response';
import { DataNotFoundException } from 'src/common/exception/service.exception';

@Injectable()
export class PostLikeService {
  constructor(
    @InjectRepository(PostLike)
    private readonly postLikeRepository: Repository<PostLike>,
    private readonly postService: PostService, 
  ) {}

  async toggleLike(postId: number, userId: number): Promise<PostLikeResponseDto> {
    const post = await this.postService.findByFields({ where: { id: postId } });
    if (!post) {
        throw DataNotFoundException('게시글을 찾을 수 없습니다.');
    }

    const existingLike = await this.postLikeRepository.findOne({
      where: { post: { id: postId }, user: { id: userId } },
      relations: ['user', 'post'], 
    });

    if (existingLike) {
        // 좋아요 actiavated인 경우 -> 좋아요 취소
        // 좋아요 deactivated인 경우 -> 다시 좋아요 누름
        existingLike.status = existingLike.status === 'deactivated' ? 'activated' : 'deactivated';
        existingLike.updatedAt = new Date();
        await this.postLikeRepository.save(existingLike);
        return {
          id: existingLike.id,
          userId: existingLike.user.id,
          postId: existingLike.post.id,
          createdAt: existingLike.createdAt,
          status: existingLike.status,
          updatedAt: existingLike.updatedAt,
        };
      } else {
        // 좋아요 생성 (처음 좋아요 눌림)
        const newLike = this.postLikeRepository.create({
          user: { id: userId },
          post: post,
          status: 'activated',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        await this.postLikeRepository.save(newLike);
        return {
          id: newLike.id,
          userId: newLike.user.id,
          postId: newLike.post.id,
          createdAt: newLike.createdAt,
          status: newLike.status,
          updatedAt: newLike.updatedAt,
        };
      }
    }
  }