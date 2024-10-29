import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostImage } from 'src/common/entities/post-image.entity';
import { Repository, QueryRunner } from 'typeorm';
import { Post } from 'src/common/entities/post.entity';
import { UploadImageDto } from 'src/post/dtos/create-post.dto';
import {
  InternalServerException,
  InvalidInputValueException,
} from 'src/common/exception/service.exception';

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

    try {
      if (queryRunner) {
        await queryRunner.manager.save(postImageEntities);
      } else {
        await this.postImageRepository.save(postImageEntities);
      }
    } catch (error) {
      throw InternalServerException('이미지 저장에 실패했습니다.');
    }
  }

  // 이미지 수정
  async updatePostImages(
    postImages: UploadImageDto[],
    post: Post,
    queryRunner?: QueryRunner,
  ) {
    const existingImages = await this.postImageRepository.find({
      where: { post: post },
      order: { orderNum: 'ASC' },
    });

    // 삭제할 이미지 목록
    const imagesToRemove = existingImages.filter(
      (existingImage) =>
        !postImages.some(
          (newImage) => newImage.orderNum === existingImage.orderNum,
        ),
    );

    // 이미지 삭제
    if (imagesToRemove.length > 0) {
      for (const image of imagesToRemove) {
        image.status = 'deactivated';
        image.orderNum = 0;
        if (queryRunner) {
          await queryRunner.manager.save(image);
        } else {
          await this.postImageRepository.save(image);
        }
      }
    }

    // 새 이미지 추가
    for (const newImage of postImages) {
      const existingImage = existingImages.find(
        (image) => image.orderNum === newImage.orderNum,
      );

      if (existingImage) {
        existingImage.url = newImage.imageurl;
        if (queryRunner) {
          await queryRunner.manager.save(existingImage);
        } else {
          await this.postImageRepository.save(existingImage);
        }
      } else {
        // 새로운 이미지 저장
        const newPostImage = this.postImageRepository.create({
          url: newImage.imageurl,
          orderNum: newImage.orderNum,
          post: post,
        });

        if (queryRunner) {
          await queryRunner.manager.save(newPostImage);
        } else {
          await this.postImageRepository.save(newPostImage);
        }
      }
    }
  }
}
