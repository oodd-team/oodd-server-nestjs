import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class KakaoAuthGuard extends AuthGuard('kakao') {
  handleRequest(err, user, info, context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();

    // 인증된 사용자를 req.kakaoUser에 저장
    req.socialUser = user;

    return user; // req.user에는 여전히 사용자가 저장되긴 하지만, req.kakaoUser로도 접근 가능
  }
}
