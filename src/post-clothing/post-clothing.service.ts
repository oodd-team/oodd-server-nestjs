import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClothingService } from 'src/clothing/clothing.service';
import { Clothing } from 'src/common/entities/clothing.entity';
import { PostClothing } from 'src/common/entities/post-clothing.entity';
import { Post } from 'src/common/entities/post.entity';
import { UploadClothingDto } from 'src/post/dtos/post.request';
import { PatchClothingDto } from 'src/post/dtos/post.request';
import { QueryRunner, Repository } from 'typeorm';

@Injectable()
export class PostClothingService {
  constructor(
    @InjectRepository(PostClothing)
    private readonly postClothingRepository: Repository<PostClothing>,
    private readonly clothingService: ClothingService,
  ) {}

  // 옷 정보 저장
  async savePostClothings(
    post: Post,
    uploadClothingDtos: UploadClothingDto[],
    queryRunner?: QueryRunner,
  ): Promise<void> {
    const savedClothings = await this.clothingService.saveClothings(
      uploadClothingDtos,
      queryRunner,
    );

    const postClothingEntities = savedClothings.map((clothing: Clothing) =>
      this.postClothingRepository.create({
        post,
        clothing,
      }),
    );

    await queryRunner.manager.save(postClothingEntities);
  }

  // 옷 정보 수정
  async updatePostClothings(
    post: Post,
    uploadClothingDtos: PatchClothingDto[],
    queryRunner?: QueryRunner,
  ): Promise<void> {
    const existingPostClothings = await this.postClothingRepository.find({
      where: { post: post, status: 'activated' },
      relations: ['clothing'],
    });

    // 빈 배열이 들어온 경우
    if (uploadClothingDtos.length === 0) {
      const clothingsToDeactivate = existingPostClothings.filter(
        (existingClothing) => existingClothing.status === 'activated',
      );

      await this.deletePostClothing(clothingsToDeactivate, queryRunner);
      return; // 함수 종료
    }

    // 삭제할 PostClothing
    const postClothingsToRemove = existingPostClothings.filter(
      (existingPostClothing) =>
        existingPostClothing.status === 'activated' &&
        !uploadClothingDtos.some(
          (newClothing) => newClothing.id === existingPostClothing.clothing.id,
        ),
    );

    if (postClothingsToRemove.length > 0) {
      await this.deletePostClothing(postClothingsToRemove, queryRunner);
    }

    // PostClothing 추가 및 수정
    const newPostClothings: PostClothing[] = [];

    for (const newClothing of uploadClothingDtos) {
      const existingPostClothing = existingPostClothings.find(
        (postClothing) => postClothing.clothing.id === newClothing.id,
      );

      if (existingPostClothing) {
        // Clothing 정보 수정
        await this.clothingService.updateClothing(newClothing, queryRunner);
      } else {
        // 새로운 Clothing 추가
        const newClothingEntity = await this.clothingService.saveClothings(
          [newClothing],
          queryRunner,
        );
        for (const clothing of newClothingEntity) {
          const newPostClothingEntity = this.postClothingRepository.create({
            post,
            clothing,
          });
          newPostClothings.push(newPostClothingEntity);
        }
      }
    }
    if (newPostClothings.length > 0) {
      await queryRunner.manager.save(newPostClothings);
    }
  }

  // PostClothing 및 Clothing 삭제 처리
  async deletePostClothing(
    postClothing: PostClothing[],
    queryRunner: QueryRunner,
  ): Promise<void> {
    await Promise.all(
      postClothing.map(async (postClothingItem) => {
        postClothingItem.status = 'deactivated';
        postClothingItem.softDelete();

        await this.clothingService.deleteClothing(
          postClothingItem.clothing,
          queryRunner,
        );

        await queryRunner.manager.save(postClothingItem);
      }),
    );
  }

  // Post에 연결된 PostClothing 및 Clothing 삭제 처리
  async deletePostClothingByPostId(
    postId: number,
    queryRunner: QueryRunner,
  ): Promise<void> {
    const clothingToRemove = await queryRunner.manager.find(PostClothing, {
      where: { post: { id: postId } },
      relations: ['clothing'],
    });

    await Promise.all(
      clothingToRemove.map(async (Postclothing) => {
        Postclothing.status = 'deactivated';
        Postclothing.softDelete();
        await this.clothingService.deleteClothing(
          Postclothing.clothing,
          queryRunner,
        );

        return queryRunner.manager.save(Postclothing);
      }),
    );
  }
}
