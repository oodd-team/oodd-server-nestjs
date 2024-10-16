import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
    @InjectRepository(Clothing)
    private readonly clothingRepository: Repository<Clothing>,
  ) {}

  async savePostClothings(
    post: Post,
    uploadClothingDtos: UploadClothingDto[],
    queryRunner: QueryRunner,
  ): Promise<void> {
    try {
      const clothingEntities = uploadClothingDtos.map(
        (clothing: UploadClothingDto) =>
          this.clothingRepository.create({
            imageUrl: clothing.imageUrl,
            brandName: clothing.brandName,
            modelName: clothing.modelName,
            modelNumber: clothing.modelNumber,
            url: clothing.url,
          }),
      );

      const savedClothings = await queryRunner.manager.save(clothingEntities);

      const postClothingEntities = savedClothings.map((clothing) =>
        this.postClothingRepository.create({
          post,
          clothing,
        }),
      );

      await queryRunner.manager.save(postClothingEntities);
    } catch (error) {
      throw InternalServerException(
        'PostClothing 저장 중 오류가 발생했습니다.',
      );
    }
  }
}
