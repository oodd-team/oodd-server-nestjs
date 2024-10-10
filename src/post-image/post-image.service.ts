import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostImage } from 'src/common/entities/post-image.entity';
import { Repository } from 'typeorm';
import { Post } from 'src/common/entities/post.entity';
import { UploadImageDto } from 'src/post/dtos/create-post.dto';
import { InternalServerException } from 'src/common/exception/service.exception';

@Injectable()
export class PostImageService {
  constructor(
    @InjectRepository(PostImage)
    private readonly postImageRepository: Repository<PostImage>,
  ) {}

  async savePostImages(postImages: UploadImageDto[], post: Post) {
    if (postImages?.length) {
      const postImageEntities = postImages.map((image: UploadImageDto) => {
        return this.postImageRepository.create({
          url: image.imageurl,
          orderNum: image.orderNum,
          post: post,
        });
      });

      try {
        await this.postImageRepository.save(postImageEntities);
      } catch (error) {
        throw InternalServerException('image 저장에 실패했습니다.');
      }
    }
  }
}
