import { Injectable } from '@nestjs/common';
import { InstagramAccountDto } from './dtos/request/instagram-account.dto';
import { InstagramFeedDto } from './dtos/response/instagram-feed.dto';
import { PhotoUploadDto } from './dtos/request/upload-image.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PostImage } from 'src/common/entities/post-image.entity';
import { Repository } from 'typeorm';
import { Post } from 'src/common/entities/post.entity';

@Injectable()
export class PostImageService {
    constructor(
        @InjectRepository(PostImage)
        private readonly postImageRepository: Repository<PostImage>,
      ) {}

    async getInstagramFeed(accountDto: InstagramAccountDto): Promise<InstagramFeedDto[]> {

        // 인스타그램 피드 불러오기 구현

        const feeds: InstagramFeedDto[] = [
            {
                id: 1,
                photoUrls: ['example',],
            }, // 최대 10장
        ];
        
        return feeds;
    }

    async uploadLocalPhoto(uploadDto: PhotoUploadDto): Promise<string[]> {
        const uploadUrls: string[] = uploadDto.photoFiles.map(file => {
            
            //로컬 사진 업로드

            return 'example';
        })

        return uploadUrls;

    }

    async createPostImages(urls: string[], post: Post): Promise<PostImage[]> {
        const postImages: PostImage[] = urls.map((url, index) => {
            const postImage = new PostImage();
            postImage.url = url;
            postImage.orderNum = index + 1;
            postImage.status = 'activated';
            postImage.createdAt = new Date();
            postImage.updatedAt = new Date();
            postImage.post = post;
            return postImage;
        });

        await this.postImageRepository.save(postImages);
        
        return postImages;
    }
}
