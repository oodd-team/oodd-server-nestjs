import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { GetAllPostsResponse } from './dtos/all-posts.response';
import {
  GetMyPostsResponse,
  GetOtherPostsResponse,
} from './dtos/user-posts.response';
import {
  CreatePostsSwagger,
  DeletePostSwagger,
  GetPostsSwagger,
  GetPostSwagger,
  PatchIsRepresentativeSwagger,
  PatchPostSwagger,
} from './post.swagger';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreatePostRequest } from './dtos/create-post.request';
import { BaseResponse } from 'src/common/response/dto';
import { AuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { Request } from 'express';
import { GetPostResponse } from './dtos/get-post.dto';
import { PatchPostDto } from './dtos/patch-Post.dto';
import { PageOptionsDto } from './dtos/page-options.dto';
import { PageDto } from './dtos/page.dto';
import dayjs from 'dayjs';
import { PageMetaDto } from './dtos/page-meta.dto';
import { DataNotFoundException } from 'src/common/exception/service.exception';
import { Post as PostEntity } from 'src/common/entities/post.entity';
import { CreatePostResponse } from './dtos/post.response';

@Controller('post')
@ApiBearerAuth('Authorization')
@UseGuards(AuthGuard)
@ApiTags('[서비스] 게시글')
export class PostController {
  constructor(private readonly postService: PostService) {}
  @Get()
  @GetPostsSwagger('게시글 리스트 조회 API')
  @ApiQuery({
    name: 'userId',
    required: false,
    description:
      'User ID가 제공되면 사용자 게시글 조회, 제공되지 않으면 전체 게시글이 조회됩니다.',
    type: Number,
  })
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
  async getPosts(
    @Req() req: Request,
    @Query() pageOptionsDto?: PageOptionsDto,
    @Query('userId') userId?: number,
  ): Promise<
    BaseResponse<
      PageDto<GetAllPostsResponse | GetMyPostsResponse | GetOtherPostsResponse>
    >
  > {
    const pageOptions = pageOptionsDto
      ? {
          ...new PageOptionsDto(),
          ...pageOptionsDto,
        }
      : new PageOptionsDto();

    const { posts, total } = userId
      ? await this.postService.getUserPosts(pageOptions, userId)
      : await this.postService.getAllPosts(pageOptions, req.user.id);

    const pageMetaDto = new PageMetaDto({
      pageOptionsDto: pageOptions,
      total,
    });

    if (pageMetaDto.last_page < pageMetaDto.page) {
      throw DataNotFoundException('해당 페이지는 존재하지 않습니다');
    }
    const postsResponse = userId
      ? this.createUserPostsResponse(posts, req.user.id, userId)
      : this.createAllPostsResponse(posts, req.user.id);

    return new BaseResponse(
      true,
      '게시글 리스트 조회 성공',
      new PageDto([postsResponse], pageMetaDto),
    );
  }

  private createUserPostsResponse(
    posts: PostEntity[],
    currentUserId: number,
    userId: number,
  ): GetMyPostsResponse | GetOtherPostsResponse {
    if (userId == currentUserId) {
      return {
        post: posts.map((post) => ({
          userId: post.user.id,
          postId: post.id,
          createdAt: dayjs(post.createdAt).format('YYYY-MM-DDTHH:mm:ssZ'),
          imageUrl: post.postImages.find(
            (image) => image.orderNum == 1 && image.status === 'activated',
          )?.url,
          isRepresentative: post.isRepresentative,
          likeCount: post.postLikes.length,
          commentCount: post.postComments.length,
          isPostLike: this.postService.checkIsPostLiked(post, currentUserId),
          isPostComment: this.postService.checkIsPostCommented(
            post,
            currentUserId,
          ),
        })),
        totalComments: this.postService.calculateTotalComments(posts),
        totalPosts: posts.length,
        totalLikes: this.postService.calculateTotalLikes(posts),
      };
    } else {
      return {
        post: posts.map((post) => ({
          userId: post.user.id,
          postId: post.id,
          createdAt: dayjs(post.createdAt).format('YYYY-MM-DDTHH:mm:ssZ'),
          imageUrl: post.postImages.find(
            (image) => image.orderNum == 1 && image.status === 'activated',
          )?.url,
          isRepresentative: post.isRepresentative,
          likeCount: post.postLikes.length,
          isPostLike: this.postService.checkIsPostLiked(post, currentUserId),
        })),
        totalPosts: posts.length,
        totalLikes: this.postService.calculateTotalLikes(posts),
      };
    }
  }
  private createAllPostsResponse(posts: PostEntity[], currentUserId: number) {
    return {
      post: posts.map((post) => ({
        postId: post.id,
        content: post.content,
        createdAt: dayjs(post.createdAt).format('YYYY-MM-DDTHH:mm:ssZ'),
        postImages: post.postImages
          .filter((image) => image.status === 'activated')
          .map((image) => ({
            url: image.url,
            orderNum: image.orderNum,
          })),
        isPostLike: this.postService.checkIsPostLiked(post, currentUserId),
        user: {
          userId: post.user.id,
          nickname: post.user.nickname,
          profilePictureUrl: post.user.profilePictureUrl,
        },
      })),
    };
  }

  @Get(':postId')
  @GetPostSwagger('게시글 상세 조회 API')
  async getPost(
    @Param('postId') postId: number,
    @Req() req: Request,
  ): Promise<BaseResponse<GetPostResponse>> {
    const currentUserId = req.user.id;

    await this.postService.validatePost(postId);

    const post = await this.postService.getPost(postId);

    const postResponse: GetPostResponse = {
      post: {
        content: post.content,
        createdAt: post.createdAt,
        postImages: post.postImages
          .filter((image) => image.status === 'activated')
          .map((image) => ({
            url: image.url,
            orderNum: image.orderNum,
          })),
        postClothings: post.postClothings
          .filter((postClothing) => postClothing.status === 'activated')
          .map((postClothing) => ({
            imageUrl: postClothing.clothing.imageUrl,
            brandName: postClothing.clothing.brandName,
            modelName: postClothing.clothing.modelName,
            modelNumber: postClothing.clothing.modelNumber,
            url: postClothing.clothing.url,
          })),
        likeCount: post.postLikes.length,
        commentCount: post.postComments.length,
        isPostLike: this.postService.checkIsPostLiked(post, currentUserId),
        user: {
          userId: post.user.id,
          nickname: post.user.nickname,
          profilePictureUrl: post.user.profilePictureUrl,
        },
        isPostWriter: post.user.id === currentUserId,
      },
    };

    return new BaseResponse(true, '게시글 조회 성공', postResponse);
  }

  @Post()
  @CreatePostsSwagger('게시글 생성 API')
  async createPost(
    @Body() createPostDto: CreatePostRequest,
    @Req() req: Request,
  ): Promise<BaseResponse<CreatePostResponse>> {
    const post = await this.postService.createPost(createPostDto, req.user.id);
    const postResponse: CreatePostResponse = {
      postId: post.id,
      userId: post.user.id,
      createdAt: dayjs(post.createdAt).format('YYYY-MM-DDTHH:mm:ssZ'),
      content: post.content,
      isRepresentative: post.isRepresentative,
      postImages: post.postImages.map((image) => ({
        imageurl: image.url,
        orderNum: image.orderNum,
      })),
      postClothings: post.postClothings.map((postClothing) => ({
        imageUrl: postClothing.clothing.imageUrl,
        brandName: postClothing.clothing.brandName,
        modelName: postClothing.clothing.modelName,
        modelNumber: postClothing.clothing.modelNumber,
        url: postClothing.clothing.url,
      })),
    };

    return new BaseResponse<CreatePostResponse>(
      true,
      '게시글 작성 성공',
      postResponse,
    );
  }

  @Patch(':postId')
  @PatchPostSwagger('게시글 수정 API')
  async patchPost(
    @Param('postId') postId: number,
    @Body() patchPostDto: PatchPostDto,
    @Req() req: Request,
  ): Promise<BaseResponse<any>> {
    const currentUserId = req.user.id;

    await this.postService.validatePost(postId, currentUserId);

    const updatedPost = await this.postService.patchPost(postId, patchPostDto);

    return new BaseResponse(true, '게시글 수정 성공', updatedPost);
  }

  @Delete(':postId')
  @DeletePostSwagger('게시글 삭제 API')
  async deletePost(
    @Param('postId') postId: number,
    @Req() req: Request,
  ): Promise<BaseResponse<any>> {
    const currentUserId = req.user.id;

    await this.postService.validatePost(postId, currentUserId);

    await this.postService.deletePost(postId, currentUserId);

    return new BaseResponse(true, '게시글이 삭제되었습니다.');
  }

  @Patch(':postId/is-representative')
  @PatchIsRepresentativeSwagger('대표 게시글 지정 API')
  async patchIsRepresentative(
    @Param('postId') postId: number,
    @Req() req: Request,
  ): Promise<BaseResponse<any>> {
    const currentUserId = req.user.id;

    await this.postService.validatePost(postId, currentUserId);

    const updatedPost = await this.postService.patchIsRepresentative(
      postId,
      currentUserId,
    );

    return new BaseResponse(true, '대표 게시글 설정/해제 성공', updatedPost);
  }
}
