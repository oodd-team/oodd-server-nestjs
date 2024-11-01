import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { JwtKakaoStrategy } from './strategies/kakao.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NaverStrategy } from './strategies/naver.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtKakaoStrategy, NaverStrategy, JwtStrategy],
  imports: [
    PassportModule,
    forwardRef(() => UserModule),
    ConfigModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '7d' },
      }),
    }),
  ],
  exports: [PassportModule, AuthService],
})
export class AuthModule {}
