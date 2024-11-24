import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserBlock } from 'src/common/entities/user-block.entity';
import { Repository } from 'typeorm';
import { CreateUserBlockDto } from './dtos/user-block.dto';
import { UserService } from 'src/user/user.service';
import {
  DataNotFoundException,
  ForbiddenException,
} from 'src/common/exception/service.exception';

@Injectable()
export class UserBlockService {
  constructor(
    @InjectRepository(UserBlock)
    private readonly userBlockRepository: Repository<UserBlock>,
    private readonly userService: UserService,
  ) {}

  async getBlockedUserIdsByRequesterId(
    currentUserId: number,
  ): Promise<number[]> {
    const blockedUsers = await this.userBlockRepository.find({
      where: { requester: { id: currentUserId }, status: 'activated' },
      relations: ['target'],
    });

    return blockedUsers.map((block) => block.target.id);
  }

  async createBlock(createUserBlockDto: CreateUserBlockDto): Promise<string> {
    const { fromUserId, toUserId, action } = createUserBlockDto;

    const fromUser = await this.userService.findByFields({
      where: { id: fromUserId, status: 'activated' },
    });
    const toUser = await this.userService.findByFields({
      where: { id: toUserId, status: 'activated' },
    });

    if (!fromUser || !toUser) {
      throw DataNotFoundException('유저를 찾을 수 없습니다.');
    }
    const existingBlock = await this.userBlockRepository.findOne({
      where: { requester: fromUser, target: toUser },
    });

    if (action === 'block') {
      if (existingBlock) {
        existingBlock.status = 'activated';
        await this.userBlockRepository.save(existingBlock);
      } else {
        const userBlock = this.userBlockRepository.create({
          requester: fromUser,
          target: toUser,
          status: 'activated',
        });
        await this.userBlockRepository.save(userBlock);
      }
      return 'BLOCKED_SUCCESS';
    } else if (action === 'unblock') {
      if (!existingBlock) {
        throw ForbiddenException('차단 이력이 존재하지 않습니다.');
      }
      existingBlock.status = 'deactivated';
      await this.userBlockRepository.save(existingBlock);
      return 'UNBLOCKED_SUCCESS';
    } else {
      throw ForbiddenException('잘못된 요청입니다.');
    }
  }

  async getBlockedUserIds(currentUserId: number): Promise<number[]> {
    const blockedUsers = await this.userBlockRepository.find({
      where: { requester: { id: currentUserId }, status: 'activated' },
      relations: ['target'],
    });

    return blockedUsers.map((block) => block.target.id);
  }
}
