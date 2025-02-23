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
import { PatchUserRequest } from './dto/response/user.request';
import { StatusEnum } from 'src/common/enum/entityStatus';
import { UserStyletagService } from 'src/user-styletag/user-styletag.service';
import dayjs from 'dayjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly dataSource: DataSource,
    private readonly userStyletagService: UserStyletagService,
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

  async getCreatedAtById(id: number): Promise<string> {
    const user = await this.userRepository.findOne({
      where: { id: id },
      select: ['createdAt'],
    });

    return dayjs(user.createdAt).format('YYYY-MM-DD HH:mm:ss');
  }

  async getUserWithTag(id: number): Promise<User | null> {
    return await this.dataSource
      .createQueryBuilder(User, 'user')
      .leftJoinAndSelect('user.userStyletags', 'userStyletag')
      .leftJoinAndSelect('userStyletag.styletag', 'styletag')
      .where('user.id = :id', { id })
      .andWhere('user.status = :status', { status: StatusEnum.ACTIVATED })
      .andWhere('userStyletag.status = :status', {
        status: StatusEnum.ACTIVATED,
      })
      .getOne();
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
    const queryRunner =
      this.userRepository.manager.connection.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const user = await queryRunner.manager.findOne(User, {
        where: { id: id, status: StatusEnum.ACTIVATED },
      });

      if (patchUserRequest.userStyletags) {
        await this.userStyletagService.saveUserStyletags(
          user,
          patchUserRequest.userStyletags,
          queryRunner,
        );
      }

      const { userStyletags, ...userFields } = patchUserRequest;
      Object.entries(userFields).forEach(([key, value]) => {
        if (value !== undefined) {
          user[key] = value;
        }
      });

      await queryRunner.manager.save(user);
      await queryRunner.commitTransaction();

      return await this.getUserWithTag(user.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw InternalServerException(error.message);
    } finally {
      await queryRunner.release();
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
