import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClothingService } from 'src/clothing/clothing.service';
import { Clothing } from 'src/common/entities/clothing.entity';
import { PostClothing } from 'src/common/entities/post-clothing.entity';
import { Post } from 'src/common/entities/post.entity';
import { InternalServerException } from 'src/common/exception/service.exception';
import { UploadClothingDto } from 'src/post/dtos/create-post.dto';
import { Repository } from 'typeorm';

@Injectable()
export class PostClothingService {
  constructor(
    @InjectRepository(PostClothing)
    private readonly postClothingRepository: Repository<PostClothing>,
    private readonly clothingService: ClothingService,
  ) {}

  async savePostClothings(
    post: Post,
    uploadClothingDtos: UploadClothingDto[],
  ): Promise<void> {
    const queryRunner =
      this.postClothingRepository.manager.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

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
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw InternalServerException(
        `PostClothing 저장 중 오류가 발생했습니다: ${error.message}`,
      );
    } finally {
      await queryRunner.release();
    }
  }
}
