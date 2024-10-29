import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClothingService } from 'src/clothing/clothing.service';
import { Clothing } from 'src/common/entities/clothing.entity';
import { PostClothing } from 'src/common/entities/post-clothing.entity';
import { Post } from 'src/common/entities/post.entity';
import { InternalServerException } from 'src/common/exception/service.exception';
import { UploadClothingDto } from 'src/post/dtos/create-post.dto';
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
    try {
      const savedClothings =
        await this.clothingService.saveClothings(uploadClothingDtos);

      const postClothingEntities = savedClothings.map((clothing: Clothing) =>
        this.postClothingRepository.create({
          post,
          clothing,
        }),
      );

      await queryRunner.manager.save(postClothingEntities);
    } catch (error) {
      throw InternalServerException(
        `PostClothing 저장 중 오류가 발생했습니다.`,
      );
    }
  }

  // 옷 정보 수정
  async updatePostClothings(
    post: Post,
    uploadClothingDtos: UploadClothingDto[],
  ): Promise<void> {
    const existingPostClothings = await this.postClothingRepository.find({
      where: { post: post, status: 'activated' },
      relations: ['clothing'],
    });

    // 빈 배열이 들어온 경우
    if (uploadClothingDtos.length === 0) {
      for (const existingClothing of existingPostClothings) {
        existingClothing.status = 'deactivated';
        existingClothing.softDelete();
        await this.clothingService.deleteClothing(existingClothing.clothing.id);
      }
      await this.postClothingRepository.save(existingPostClothings);
      return; //함수 종료
    }

    const queryRunner =
      this.postClothingRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 삭제할 PostClothing
      const postClothingsToRemove = existingPostClothings.filter(
        (existingPostClothing) =>
          !uploadClothingDtos.some(
            (newClothing) =>
              newClothing.id === existingPostClothing.clothing.id,
          ),
      );

      for (const postClothing of postClothingsToRemove) {
        postClothing.status = 'deactivated';
        postClothing.softDelete();
      }

      // 수정할 기존 PostClothing
      for (const newClothing of uploadClothingDtos) {
        const existingPostClothing = existingPostClothings.find(
          (postClothing) => postClothing.clothing.id === newClothing.id,
        );

        if (existingPostClothing) {
          // Clothing 정보 수정
          await this.clothingService.updateClothing(newClothing);
        } else {
          // 새로운 옷 정보 추가
          const newClothingEntity = await this.clothingService.saveClothings([
            newClothing,
          ]);
          for (const clothing of newClothingEntity) {
            const newPostClothingEntity = this.postClothingRepository.create({
              post,
              clothing,
            });
            await queryRunner.manager.save(newPostClothingEntity);
          }
        }
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw InternalServerException(
        `PostClothing 저장 중 오류가 발생했습니다.`,
      );
    } finally {
      await queryRunner.release();
    }
  }
}
