import { forwardRef, Module } from '@nestjs/common';
import { ChatRoomService } from './chat-room.service';
import { ChatRoom } from 'src/common/entities/chat-room.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatMessageModule } from 'src/chat-message/chat-message.module';
import { MatchingModule } from 'src/matching/matching.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatRoom]),
    forwardRef(() => ChatMessageModule),
  ],
  providers: [ChatRoomService],
  exports: [ChatRoomService],
})
export class ChatRoomModule {}
