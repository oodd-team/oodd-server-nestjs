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
import { GetAllPostsResponse } from './dto/all-posts.response';
import {
  GetMyPostsResponse,
  GetOtherPostsResponse,
} from './dto/user-posts.response';
import {
  CreatePostsSwagger,
  DeletePostSwagger,
  GetPostsSwagger,
  GetPostSwagger,
  PatchIsRepresentativeSwagger,
  PatchPostSwagger,
} from './post.swagger';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreatePostRequest } from './dto/request/post.request';
import { BaseResponse } from 'src/common/response/dto';
import { AuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { Request } from 'express';
import { PostDetailResponse } from './dto/post.response';
import { PatchPostRequest } from './dto/request/post.request';

import {
  DataNotFoundException,
  UnauthorizedException,
} from 'src/common/exception/service.exception';
import { PostResponse } from './dto/post.response';
import { PageOptionsDto } from 'src/common/response/page-options.dto';
import { PageMetaDto } from 'src/common/response/page-meta.dto';

@Controller('post')
@ApiBearerAuth('Authorization')
@UseGuards(AuthGuard)
@ApiTags('[서비스] 게시글')
export class PostController {
  constructor(private readonly postService: PostService) {}
  @Get()
  @GetPostsSwagger('게시글 리스트 조회 API')
  async getPosts(
    @Req() req: Request,
    @Query() pageOptionsDto?: PageOptionsDto,
    @Query('userId') userId?: number,
  ): Promise<
    BaseResponse<
      (
        | GetAllPostsResponse
        | GetMyPostsResponse
        | GetOtherPostsResponse
        | { posts: []; meta: PageMetaDto }
      ) & {
        meta: PageMetaDto;
      }
    >
  > {
    const pageOptions = pageOptionsDto
      ? {
          ...new PageOptionsDto(),
          ...pageOptionsDto,
        }
      : new PageOptionsDto();

    let posts: GetAllPostsResponse | GetMyPostsResponse | GetOtherPostsResponse;
    let total: number;

    if (userId) {
      // 사용자 게시글 조회
      ({ posts, total } = await this.postService.getUserPosts(
        pageOptions,
        userId,
        req.user.id,
      ));
    } else {
      // 전체 게시글 조회
      ({ posts, total } = await this.postService.getAllPosts(
        pageOptions,
        req.user.id,
      ));
    }
    const pageMetaDto = new PageMetaDto({ pageOptionsDto: pageOptions, total });

    if (
      pageMetaDto.last_page >= 1 &&
      pageMetaDto.last_page < pageMetaDto.page
    ) {
      return new BaseResponse(false, '해당 페이지는 존재하지 않습니다', {
        posts: [],
        meta: pageMetaDto,
      });
    }

    return new BaseResponse(true, '게시글 리스트 조회 성공', {
      ...posts,
      meta: pageMetaDto,
    });
  }

  @Get(':postId')
  @GetPostSwagger('게시글 상세 조회 API')
  async getPost(
    @Param('postId') postId: number,
    @Req() req: Request,
  ): Promise<BaseResponse<PostDetailResponse>> {
    const post = await this.postService.getPost(postId, req.user.id);
    if (!post) {
      throw DataNotFoundException('해당 게시글을 찾을 수 없습니다.');
    }

    const postDetailResponse = new PostDetailResponse(post, req.user.id);
    return new BaseResponse(true, '게시글 조회 성공', postDetailResponse);
  }

  @Post()
  @CreatePostsSwagger('게시글 생성 API')
  async createPost(
    @Body() createPostDto: CreatePostRequest,
    @Req() req: Request,
  ): Promise<BaseResponse<PostResponse>> {
    const post = await this.postService.createPost(createPostDto, req.user.id);
    const postResponse: PostResponse = {
      postId: post.id,
      userId: post.user.id,
      content: post.content,
      isRepresentative: post.isRepresentative,
      postStyletags: post.postStyletags?.map((tag) => tag.styletag.tag),
      postImages: post.postImages.map((image) => ({
        imageUrl: image.url,
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

    return new BaseResponse<PostResponse>(
      true,
      '게시글 작성 성공',
      postResponse,
    );
  }

  @Patch(':postId')
  @PatchPostSwagger('게시글 수정 API')
  async patchPost(
    @Param('postId') postId: number,
    @Body() patchPostDto: PatchPostRequest,
    @Req() req: Request,
  ): Promise<BaseResponse<PostResponse>> {
    const post = await this.postService.getPostById(postId);
    if (req.user.id !== post.user.id) {
      throw UnauthorizedException('권한이 없습니다.');
    }
    const updatedPost = await this.postService.patchPost(
      post,
      patchPostDto,
      req.user.id,
    );
    const postResponse: PostResponse = {
      postId: updatedPost.id,
      userId: updatedPost.user.id,
      content: updatedPost.content,
      isRepresentative: updatedPost.isRepresentative,
      postStyletags: post.postStyletags?.map((tag) => tag.styletag.tag),
      postImages: updatedPost.postImages.map((image) => ({
        imageUrl: image.url,
        orderNum: image.orderNum,
      })),
      postClothings: updatedPost.postClothings.map((postClothing) => ({
        imageUrl: postClothing.clothing.imageUrl,
        brandName: postClothing.clothing.brandName,
        modelName: postClothing.clothing.modelName,
        modelNumber: postClothing.clothing.modelNumber,
        url: postClothing.clothing.url,
      })),
    };
    return new BaseResponse<PostResponse>(
      true,
      '게시글 수정 성공',
      postResponse,
    );
  }

  @Delete(':postId')
  @DeletePostSwagger('게시글 삭제 API')
  async deletePost(
    @Param('postId') postId: number,
    @Req() req: Request,
  ): Promise<BaseResponse<any>> {
    await this.postService.deletePost(postId, req.user.id);

    return new BaseResponse(true, '게시글이 삭제되었습니다.');
  }

  @Patch(':postId/is-representative')
  @PatchIsRepresentativeSwagger('대표 게시글 지정 API')
  async patchIsRepresentative(
    @Param('postId') postId: number,
    @Req() req: Request,
  ): Promise<BaseResponse<any>> {
    await this.postService.patchIsRepresentative(postId, req.user.id);

    return new BaseResponse(true, '대표 게시글 설정/해제 성공');
  }
}
