import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostImage } from 'src/common/entities/post-image.entity';
import { Repository, QueryRunner } from 'typeorm';
import { Post } from 'src/common/entities/post.entity';
import { UploadImageDto } from 'src/post/dtos/create-post.dto';
import { InvalidInputValueException } from 'src/common/exception/service.exception';
import { PatchImageDto } from 'src/post/dtos/patch-Post.dto';

@Injectable()
export class PostImageService {
  constructor(
    @InjectRepository(PostImage)
    private readonly postImageRepository: Repository<PostImage>,
  ) {}

  // 이미지 저장
  async savePostImages(
    postImages: UploadImageDto[],
    post: Post,
    queryRunner?: QueryRunner,
  ) {
    // 빈 배열이 들어온 경우
    if (postImages.length === 0) {
      throw InvalidInputValueException('하나 이상의 이미지를 업로드하세요.');
    }

    const postImageEntities = postImages.map((image: UploadImageDto) => {
      return this.postImageRepository.create({
        url: image.imageurl,
        orderNum: image.orderNum,
        post: post,
      });
    });
    await queryRunner.manager.save(postImageEntities);
  }

  // 이미지 수정
  async updatePostImages(
    postImages: PatchImageDto[],
    post: Post,
    queryRunner?: QueryRunner,
  ) {
    // 빈 배열이 들어온 경우
    if (postImages.length === 0) {
      throw InvalidInputValueException('하나 이상의 이미지를 업로드하세요.');
    }

    const existingImages = await queryRunner.manager.find(PostImage, {
      where: { post: post },
      order: { orderNum: 'ASC' },
    });

    const existingImageIds = new Set(existingImages.map((img) => img.id));

    // 삭제할 이미지 목록
    const imagesToRemove = existingImages.filter(
      (existingImage) =>
        existingImage.status === 'activated' &&
        !postImages.some((newImage) => newImage.id === existingImage.id),
    );

    // 이미지 삭제
    await Promise.all(
      imagesToRemove.map(async (image) => {
        image.status = 'deactivated';
        image.softDelete();
        image.orderNum = 0;
        return queryRunner.manager.save(image);
      }),
    );

    // 새 이미지 추가
    await Promise.all(
      postImages.map(async (newImage) => {
        if (existingImageIds.has(newImage.id)) {
          const existingImage = existingImages.find(
            (image) => image.id === newImage.id,
          );

          // 기존 이미지의 orderNum이 수정된 경우
          if (existingImage && existingImage.orderNum !== newImage.orderNum) {
            existingImage.orderNum = newImage.orderNum;
            return queryRunner.manager.save(existingImage);
          }
        } else {
          // 새로운 이미지 저장
          const newPostImage = this.postImageRepository.create({
            url: newImage.imageurl,
            orderNum: newImage.orderNum,
            post,
          });
          return queryRunner.manager.save(newPostImage);
        }
      }),
    );
  }
}
