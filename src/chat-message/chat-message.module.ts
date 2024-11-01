import { Module } from '@nestjs/common';
import { ChatMessageService } from './chat-message.service';
import { ChatMessageController } from './chat-message.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatMessage } from 'src/common/entities/chat-message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChatMessage])],
  providers: [ChatMessageService],
  controllers: [ChatMessageController],
  exports: [ChatMessageService],
})
export class ChatMessageModule {}
