import { forwardRef, Module } from '@nestjs/common';
import { ChatRoomController } from './chat-room.controller';
import { ChatRoomService } from './chat-room.service';
import { ChatRoom } from 'src/common/entities/chat-room.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatMessageModule } from 'src/chat-message/chat-message.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatRoom]),
    forwardRef(() => ChatMessageModule),
  ],
  controllers: [ChatRoomController],
  providers: [ChatRoomService],
  exports: [ChatRoomService],
})
export class ChatRoomModule {}
