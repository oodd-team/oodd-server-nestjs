import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { Clothing } from 'src/common/entities/clothing.entity';
import { UploadClothingDto } from 'src/post/dtos/create-post.dto';
import { DataNotFoundException } from 'src/common/exception/service.exception';
import { PatchClothingDto } from 'src/post/dtos/patch-Post.dto';

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

  // Clothing 수정
  async updateClothing(
    uploadClothingDto: PatchClothingDto,
    queryRunner: QueryRunner,
  ): Promise<Clothing> {
    const existingClothing = await this.clothingRepository.findOne({
      where: { id: uploadClothingDto.id, status: 'activated' },
    });

    if (!existingClothing) {
      throw DataNotFoundException(
        `Clothing ID ${uploadClothingDto.id}를 찾을 수 없습니다.`,
      );
    }

    // 필드 업데이트
    if (uploadClothingDto.imageUrl)
      existingClothing.imageUrl = uploadClothingDto.imageUrl;
    if (uploadClothingDto.brandName)
      existingClothing.brandName = uploadClothingDto.brandName;
    if (uploadClothingDto.modelName)
      existingClothing.modelName = uploadClothingDto.modelName;
    if (uploadClothingDto.modelNumber)
      existingClothing.modelNumber = uploadClothingDto.modelNumber;
    if (uploadClothingDto.url) existingClothing.url = uploadClothingDto.url;

    return await queryRunner.manager.save(existingClothing);
  }

  // Clothing 삭제 처리
  async deleteClothing(clothing: Clothing): Promise<Clothing> {
    clothing.status = 'deactivated';
    clothing.softDelete();
    return await this.clothingRepository.save(clothing);
  }
}
