import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../common/entities/post.entity';
import { GetPostsResponse } from './dtos/total-postsResponse.dto';
import {
  GetMyPostsResponse,
  GetOtherPostsResponse,
} from './dtos/user-postsResponse.dto';
import { UserService } from 'src/user/user.service';
import { PostImageService } from 'src/post-image/post-image.service';
import { CreatePostDto } from './dtos/create-post.dto';
import {
  DataNotFoundException,
  InternalServerException,
} from 'src/common/exception/service.exception';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly userService: UserService,
    private readonly postImageService: PostImageService,
  ) {}

  //게시글 생성
  async createPost(uploadPostDto: CreatePostDto, userId: number) {
    const { content, postImages, isRepresentative } = uploadPostDto;

    const user = await this.userService.findByFields({
      where: { id: userId },
    });

    const post = this.postRepository.create({
      user,
      content,
      isRepresentative,
    });

    let savedPost;
    try {
      savedPost = this.postRepository.save(post);
    } catch (error) {
      throw InternalServerException('게시글 저장에 실패했습니다.');
    }

    await this.postImageService.savePostImages(postImages, savedPost);

    return savedPost;
  }

  //게시글 리스트 조회
  async getPosts(
    userId?: number,
    currentUserId?: number,
  ): Promise<GetPostsResponse | GetMyPostsResponse | GetOtherPostsResponse> {
    const currentUser = await this.userService.findByFields({
      where: { id: currentUserId },
    });

    //전체 게시글 조회
    if (!userId) {
      const posts = await this.postRepository.find({
        relations: ['postImages'],
      });

      if (!posts || posts.length === 0) {
        throw DataNotFoundException('게시글을 찾을 수 없습니다.');
      }

      return {
        post: posts.map((post) => ({
          content: post.content,
          createdAt: post.createdAt,
          postImages: post.postImages.map((image) => ({
            url: image.url,
            orderNum: image.orderNum,
          })),
          isPostLike: this.checkIsPostLiked(post, currentUserId),
        })),
        user: {
          nickname: currentUser.nickname,
          profilePictureUrl: currentUser.profilePictureUrl,
        },
        isMatching: false,
      };
    } else {
      //내 게시글 조회
      if (userId === currentUserId) {
        const userPosts = await this.postRepository.find({
          where: { user: { id: userId } },
          relations: ['postImages', 'postComments', 'postLikes'],
        });

        if (!userPosts || userPosts.length === 0) {
          throw DataNotFoundException('게시글을 찾을 수 없습니다.');
        }

        return {
          posts: userPosts.map((post) => ({
            content: post.content,
            createdAt: post.createdAt,
            imageUrl: post.postImages.find((image) => image.orderNum === 1)
              ?.url,
            isRepresentative: post.isRepresentative,
            likeCount: post.postLikes.length,
            comments: post.postComments.map((comment) => ({
              content: comment.content,
              createdAt: comment.createdAt,
              user: comment.user,
            })),
            isPostLike: this.checkIsPostLiked(post, currentUserId),
            isPostComment: this.checkIsPostCommented(post, currentUserId),
          })),
          totalComments: this.calculateTotalComments(userPosts),
          totalPosts: userPosts.length,
          totalLikes: this.calculateTotalLikes(userPosts),
        };
      } else {
        // 다른 user 게시글 조회
        const otherPosts = await this.postRepository.find({
          where: { user: { id: userId } },
          relations: ['postImages', 'postLikes'],
        });

        if (!otherPosts || otherPosts.length === 0) {
          throw DataNotFoundException(
            '해당 사용자의 게시글을 찾을 수 없습니다.',
          );
        }

        return {
          posts: otherPosts.map((post) => ({
            content: post.content,
            createdAt: post.createdAt,
            imageUrl: post.postImages.find((image) => image.orderNum === 1)
              ?.url,
            isRepresentative: post.isRepresentative,
            likeCount: post.postLikes.length,
            isPostLike: this.checkIsPostLiked(post, currentUserId),
          })),
          totalPosts: otherPosts.length,
          totalLikes: this.calculateTotalLikes(otherPosts),
        };
      }
    }
  }

  // 총 댓글 수
  private calculateTotalComments(posts: Post[]): number {
    return posts.reduce((acc, post) => acc + post.postComments.length, 0);
  }

  // 총 좋아요 수
  private calculateTotalLikes(posts: Post[]): number {
    return posts.reduce((acc, post) => acc + post.postLikes.length, 0);
  }

  // 유저가 게시물에 좋아요를 눌렀는지 확인
  private checkIsPostLiked(post: Post, currentUserId: number): boolean {
    return post.postLikes.some((like) => like.user.id === currentUserId);
  }

  // 유저가 게시물에 댓글을 달았는지 확인
  private checkIsPostCommented(post: Post, currentUserId: number): boolean {
    return post.postComments.some(
      (comment) => comment.user.id === currentUserId,
    );
  }
}

// 페이징
