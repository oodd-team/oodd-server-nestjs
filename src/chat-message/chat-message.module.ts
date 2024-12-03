import { forwardRef, Module } from '@nestjs/common';
import { ChatMessageService } from './chat-message.service';
import { ChatMessageController } from './chat-message.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatMessage } from 'src/common/entities/chat-message.entity';
import { UserModule } from 'src/user/user.module';
import { ChatRoomModule } from 'src/chat-room/chat-room.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatMessage]),
    forwardRef(() => UserModule),
    forwardRef(() => ChatRoomModule),
  ],
  providers: [ChatMessageService],
  controllers: [ChatMessageController],
  exports: [ChatMessageService],
})
export class ChatMessageModule {}
