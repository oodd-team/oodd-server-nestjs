import { Module } from '@nestjs/common';
import { MatchingController } from './matching.controller';
import { MatchingService } from './matching.service';
import { Matching } from 'src/common/entities/matching.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatMessageModule } from 'src/chat-message/chat-message.module';
import { ChatRoomModule } from 'src/chat-room/chat-room.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Matching]),
    ChatMessageModule,
    ChatRoomModule,
    UserModule,
  ],
  controllers: [MatchingController],
  providers: [MatchingService],
})
export class MatchingModule {}
