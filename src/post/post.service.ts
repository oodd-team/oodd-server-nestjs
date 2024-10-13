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
import { PostStyletagService } from '../post-styletag/post-styletag.service';

import {
  DataNotFoundException,
  InternalServerException,
} from 'src/common/exception/service.exception';
import { PatchPostDto } from './dtos/patch-Post.dto';
import { GetPostResponse } from './dtos/get-post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly userService: UserService,
    private readonly postImageService: PostImageService,
    private readonly postStyletagService: PostStyletagService,
  ) {}

  //게시글 리스트 조회
  async getPosts(
    userId?: number,
    currentUserId?: number,
  ): Promise<GetPostsResponse | GetMyPostsResponse | GetOtherPostsResponse> {
    const where = userId ? { user: { id: userId } } : {};
    const relations = ['postImages', 'postComments', 'postLikes', 'user'];

    const posts = await this.postRepository.find({
      where: where,
      relations: relations,
    });

    if (!posts || posts.length === 0) {
      throw DataNotFoundException('게시글을 찾을 수 없습니다.');
    }

    if (!userId) {
      // 전체 게시글 조회
      return this.PostsResponse(posts, currentUserId);
    } else if (userId === currentUserId) {
      // 내 게시글 조회
      return this.MyPostsResponse(posts, currentUserId);
    } else {
      // 다른 user 게시글 조회
      return this.OtherPostsResponse(posts, currentUserId);
    }
  }

  private PostsResponse(posts: Post[], currentUserId?: number) {
    return {
      post: posts.map((post) => ({
        content: post.content,
        createdAt: post.createdAt,
        postImages: post.postImages.map((image) => ({
          url: image.url,
          orderNum: image.orderNum,
        })),
        isPostLike: this.checkIsPostLiked(post, currentUserId),
        user: {
          nickname: post.user.nickname,
          profilePictureUrl: post.user.profilePictureUrl,
        },
      })),
      isMatching: false,
    };
  }

  private MyPostsResponse(posts: Post[], currentUserId?: number) {
    return {
      posts: posts.map((post) => ({
        content: post.content,
        createdAt: post.createdAt,
        imageUrl: post.postImages.find((image) => image.orderNum === 1)?.url,
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
      totalComments: this.calculateTotalComments(posts),
      totalPosts: posts.length,
      totalLikes: this.calculateTotalLikes(posts),
    };
  }

  private OtherPostsResponse(posts: Post[], currentUserId?: number) {
    return {
      posts: posts.map((post) => ({
        content: post.content,
        createdAt: post.createdAt,
        imageUrl: post.postImages.find((image) => image.orderNum === 1)?.url,
        isRepresentative: post.isRepresentative,
        likeCount: post.postLikes.length,
        isPostLike: this.checkIsPostLiked(post, currentUserId),
      })),
      totalPosts: posts.length,
      totalLikes: this.calculateTotalLikes(posts),
    };
  }

  //게시글 생성
  async createPost(uploadPostDto: CreatePostDto, userId: number) {
    const { content, postImages, isRepresentative, postStyletags } =
      uploadPostDto;

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
      savedPost = await this.postRepository.save(post);
    } catch (error) {
      throw InternalServerException('게시글 저장에 실패했습니다.');
    }

    // postImage 저장
    await this.postImageService.savePostImages(postImages, savedPost);

    // styletag 저장
    if (postStyletags) {
      await this.postStyletagService.savePostStyletags(
        savedPost,
        postStyletags,
      );
    }

    return savedPost;
  }

  // 게시글 수정
  async patchPost(postId: number, patchPostDto: PatchPostDto, userId: number) {
    const { content, postImages, isRepresentative, postStyletags } =
      patchPostDto;

    const post = await this.postRepository.findOne({
      where: { id: postId, user: { id: userId } },
    });

    if (!post) {
      throw DataNotFoundException('게시글을 찾을 수 없습니다.');
    }

    if (content !== undefined) {
      post.content = content;
    }
    if (isRepresentative !== undefined) {
      post.isRepresentative = isRepresentative;
    }

    let updatedPost;
    try {
      updatedPost = await this.postRepository.save(post);
    } catch (error) {
      throw InternalServerException('게시글 수정에 실패했습니다.');
    }

    // postImage 업데이트
    if (postImages) {
      await this.postImageService.savePostImages(postImages, updatedPost);
    }

    // styletag 업데이트
    if (postStyletags) {
      await this.postStyletagService.savePostStyletags(
        updatedPost,
        postStyletags,
      );
    }

    return updatedPost;
  }

  // 게시글 상세 조회
  async getPost(
    postId: number,
    currentUserId?: number,
  ): Promise<GetPostResponse> {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['postImages'],
    });

    if (!post) {
      throw DataNotFoundException('게시글을 찾을 수 없습니다.');
    }

    return {
      post: {
        content: post.content,
        createdAt: post.createdAt,
        postImages: post.postImages.map((image) => ({
          url: image.url,
          orderNum: image.orderNum,
        })),
        isPostLike: this.checkIsPostLiked(post, currentUserId),
        user: {
          nickname: post.user.nickname,
          profilePictureUrl: post.user.profilePictureUrl,
        },
      },
    };
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
