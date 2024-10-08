import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { KakaoUser } from 'src/auth/dto/auth.dto';
import { User } from 'src/common/entities/user.entity';
import { InternalServerException } from 'src/common/exception/service.exception';
import { DataSource, FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly authService: AuthService,
    private dataSource: DataSource,
  ) {}

  async findByFields(fields: FindOneOptions<User>) {
    return await this.userRepository.findOne(fields);
  }

  async getUserByKaKaoId(kakaoId: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { kakaoId: kakaoId, status: 'activated' },
    });
  }

  async createUserByKakao(user: KakaoUser): Promise<string> {
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
}
