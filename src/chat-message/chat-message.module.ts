import { Module } from '@nestjs/common';
import { ChatMessageService } from './chat-message.service';
import { ChatMessageController } from './chat-message.controller';

@Module({
  providers: [ChatMessageService],
  controllers: [ChatMessageController]
})
export class ChatMessageModule {}
