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
    const user = await this.userRepository.findOne({
      where: { id: id, status: 'activated' },
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
}
