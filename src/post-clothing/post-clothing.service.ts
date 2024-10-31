import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClothingService } from 'src/clothing/clothing.service';
import { Clothing } from 'src/common/entities/clothing.entity';
import { PostClothing } from 'src/common/entities/post-clothing.entity';
import { Post } from 'src/common/entities/post.entity';
import { UploadClothingDto } from 'src/post/dtos/create-post.dto';
import { QueryRunner, Repository } from 'typeorm';

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
}
