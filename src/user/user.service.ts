import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { SocialUser } from 'src/auth/dto/auth.dto';
import { User } from 'src/common/entities/user.entity';
import { InternalServerException } from 'src/common/exception/service.exception';
import { DataSource, FindOneOptions, Repository } from 'typeorm';
import { PatchUserRequest } from './dto/patch-user.request';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly authService: AuthService,
    private readonly dataSource: DataSource,
  ) {}

  async findByFields(fields: FindOneOptions<User>) {
    return await this.userRepository.findOne(fields);
  }

  async getUserByKaKaoId(kakaoId: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { kakaoId: kakaoId, status: 'activated' },
    });
  }

  async getUserByNaverId(naverId: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { naverId: naverId, status: 'activated' },
    });
  }

  async getUserById(id: number): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { id: id, status: 'activated' },
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
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await queryRunner.manager.findOne(User, {
        where: { id: id, status: 'activated' },
      });

      if (patchUserRequest.nickname !== undefined) {
        user.nickname = patchUserRequest.nickname;
      }
      if (patchUserRequest.profilePictureUrl !== undefined) {
        user.profilePictureUrl = patchUserRequest.profilePictureUrl;
      }
      if (patchUserRequest.bio !== undefined) {
        user.bio = patchUserRequest.bio;
      }

      const updatedUser = await queryRunner.manager.save(User, user);
      await queryRunner.commitTransaction();
      return updatedUser;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw InternalServerException(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async patchUserTerms(id: number): Promise<User> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await queryRunner.manager.findOne(User, {
        where: { id: id, status: 'activated' },
      });

      user.privateTermAcceptedAt = new Date();

      await queryRunner.manager.save(user);
      await queryRunner.commitTransaction();

      return user;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw InternalServerException(error.message);
    } finally {
      await queryRunner.release();
    }
  }
}
