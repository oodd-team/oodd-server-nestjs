import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { SocialUser } from 'src/auth/dto/auth.dto';
import { User } from 'src/common/entities/user.entity';
import {
  DataNotFoundException,
  InternalServerException,
} from 'src/common/exception/service.exception';
import { DataSource, FindOneOptions, Repository } from 'typeorm';
import { PatchUserRequest } from './dto/response/patch-user.request';
import { StatusEnum } from 'src/common/enum/entityStatus';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly dataSource: DataSource,
  ) {}

  async findByFields(fields: FindOneOptions<User>) {
    return await this.userRepository.findOne(fields);
  }

  async getUserByKaKaoId(kakaoId: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { kakaoId: kakaoId, status: StatusEnum.ACTIVATED },
    });
  }

  async getUserByNaverId(naverId: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { naverId: naverId, status: StatusEnum.ACTIVATED },
    });
  }

  async getUserById(id: number): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { id: id, status: StatusEnum.ACTIVATED },
    });
  }

  async createUserByKakaoOrNaver(user: SocialUser): Promise<string> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const userData = await queryRunner.manager.save(User, user);
      const jwtToken = await this.authService.generateJwtToken(userData);
      await queryRunner.commitTransaction();
      return jwtToken;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw InternalServerException(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async PatchUser(
    id: number,
    patchUserRequest: PatchUserRequest,
  ): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: id, status: StatusEnum.ACTIVATED },
    });

    try {
      Object.entries(patchUserRequest).forEach(([key, value]) => {
        if (value !== undefined) {
          user[key] = value;
        }
      });

      return await this.userRepository.save(user);
    } catch (error) {
      throw InternalServerException(error.message);
    }
  }

  async patchUserTerms(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: id, status: StatusEnum.ACTIVATED },
    });

    try {
      user.privacyTermAcceptedAt = new Date();
      await this.userRepository.save(user);
      return user;
    } catch (error) {
      throw InternalServerException(error.message);
    }
  }

  async softDeleteUser(id: number): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: id, status: StatusEnum.ACTIVATED },
    });
    if (!user) {
      throw DataNotFoundException('유저를 찾을 수 없습니다.');
    }

    user.deletedAt = new Date();
    user.status = StatusEnum.DEACTIVATED;

    try {
      await this.userRepository.save(user);
    } catch (error) {
      throw InternalServerException('회원 탈퇴에 실패했습니다.');
    }
  }
}
