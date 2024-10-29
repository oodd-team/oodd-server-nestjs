import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

    return await this.clothingRepository.save(clothingEntities);
  }

  /*
  // Clothing 수정
  async updateClothing(
    uploadClothingDto: UploadClothingDto,
  ): Promise<Clothing> {
    const existingClothing = await this.clothingRepository.findOne(
      uploadClothingDto.id,
    );

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

    // 업데이트된 Clothing 저장
    return await this.clothingRepository.save(existingClothing);
  }*/
}
