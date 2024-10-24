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
    private readonly clothingService: ClothingService, // ClothingService 주입
  ) {}

  async savePostClothings(
    post: Post,
    uploadClothingDtos: UploadClothingDto[],
  ): Promise<void> {
    try {
      // Clothing 저장은 ClothingService에서 처리
      const savedClothings =
        await this.clothingService.saveClothings(uploadClothingDtos);

      // Post와 Clothing을 연결
      const postClothingEntities = savedClothings.map((clothing: Clothing) =>
        this.postClothingRepository.create({
          post,
          clothing,
        }),
      );

      // postClothing 저장
      await this.postClothingRepository.save(postClothingEntities);
    } catch (error) {
      throw InternalServerException(
        'PostClothing 저장 중 오류가 발생했습니다.',
      );
    }
  }
}
