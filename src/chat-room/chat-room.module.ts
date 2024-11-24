import { Module } from '@nestjs/common';
import { ChatRoomController } from './chat-room.controller';
import { ChatRoomService } from './chat-room.service';
import { ChatRoom } from 'src/common/entities/chat-room.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsGateway } from 'src/eventGateway';
import { ChatMessageModule } from 'src/chat-message/chat-message.module';

@Module({
  imports: [TypeOrmModule.forFeature([ChatRoom]), ChatMessageModule],
  controllers: [ChatRoomController],
  providers: [ChatRoomService, EventsGateway],
  exports: [ChatRoomService],
})
export class ChatRoomModule {}
