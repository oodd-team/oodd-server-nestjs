import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { Clothing } from 'src/common/entities/clothing.entity';
import { UploadClothingDto } from 'src/post/dtos/create-post.dto';

@Injectable()
export class ClothingService {
  constructor(
    @InjectRepository(Clothing)
    private readonly clothingRepository: Repository<Clothing>,
  ) {}

  // Clothing 엔티티 저장
  async saveClothings(
    uploadClothingDtos: UploadClothingDto[],
    queryRunner: QueryRunner,
  ): Promise<Clothing[]> {
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

    return await queryRunner.manager.save(clothingEntities);
  }
}
