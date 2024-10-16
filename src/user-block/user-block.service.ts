import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserBlock } from 'src/common/entities/user-block.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserBlockService {
  constructor(
    @InjectRepository(UserBlock)
    private readonly userBlockRepository: Repository<UserBlock>,
  ) {}

  async getBlockedUserIds(currentUserId: number): Promise<number[]> {
    const blockedUsers = await this.userBlockRepository.find({
      where: { requester: { id: currentUserId }, status: 'activated' },
      relations: ['target'],
    });

    return blockedUsers.map((block) => block.target.id);
  }
}
