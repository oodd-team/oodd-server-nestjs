import { Global, Module } from '@nestjs/common';
import dayjs from 'dayjs';

@Global() // 전역 모듈로 설정
@Module({
  providers: [
    {
      provide: 'DAYJS', // DI 토큰으로 'DAYJS' 사용
      useValue: dayjs, // day.js 인스턴스를 제공
    },
  ],
  exports: ['DAYJS'], // 다른 모듈에서 사용할 수 있도록 export
})
export class DayjsModule {}
