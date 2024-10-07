import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../common/entities/post.entity';
import { TotalPostsDto } from './dtos/response/total-postsResponse.dto';
import { UserPostsDto } from './dtos/response/user-postsResponse.dto';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,
      ) {}
    
      async findAll(userId?: number): Promise<(TotalPostsDto | UserPostsDto)[]> {
        if (userId){
            const posts = await this.postRepository
            .createQueryBuilder('post')
            .leftJoin('post.user', 'user')
            .leftJoinAndSelect('post.postImages', 'postImages')
            .where('user.id = :userId', { userId })
            .orderBy('post.createdAt', 'DESC')
            .select([
                'post.id',
                'post.isRepresentative',
                'post.createdAt',
                'post.updatedAt',
                'post.deletedAt',
                'postImages.id',
                'postImages.url',
                'postImages.orderNum',
            ])
            .getMany();

            return posts.map(post => ({
                id: post.id,
                isRepresentative: post.isRepresentative,
                createdAt: post.createdAt,
                updatedAt: post.updatedAt,
                deletedAt: post.deletedAt,
                images: post.postImages.map(image => ({
                  id: image.id,
                  url: image.url,
                  orderNum: image.orderNum,
                })),
                likeCount: post.likeCount,
                commentCount: post.commentCount,
            }));
        }
        
        const posts = await this.postRepository
        .createQueryBuilder('post')
        .leftJoin('post.user', 'user')
        .leftJoinAndSelect('post.postImages', 'postImages')
        .orderBy('post.createdAt', 'DESC')
        .select([
            'post.id',
            'post.content',
            'post.createdAt',
            'post.updatedAt',
            'post.deletedAt',
            'postImages.id',
            'postImages.url',
            'postImages.orderNum',
            'user.id',
            'user.nickname',
            'user.profilePictureUrl',
        ])
        .getMany();

        return posts.map(post => ({
            id: post.id,
            content: post.content,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
            deletedAt: post.deletedAt,
            images: post.postImages.map(image => ({
              id: image.id,
              url: image.url,
              orderNum: image.orderNum,
            })),
            user: { 
                id: post.user.id, 
                nickname: post.user.nickname ,
                profilePictureUrl: post.user.profilePictureUrl,
            },
        }));
    }

    async UserPostCount(userId: number): Promise<number> {
        const userPostCount = await this.postRepository
        .createQueryBuilder('post')
        .where('post.userId = :userId', { userId })
        .getCount();

        return userPostCount;
    }

    async UserLikeCount(userId: number): Promise<number> {
        const { userLikeCount } = await this.postRepository
        .createQueryBuilder('post')
        .leftJoin('post.postLikes', 'postLikes')
        .where('post.userId = :userId', { userId })
        .select('COUNT(postLikes.id)', 'likeCount')
        .getRawOne();

        return userLikeCount ? Number(userLikeCount) : 0;
    }
 }

