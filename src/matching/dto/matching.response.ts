import { PickType } from '@nestjs/swagger';
import { ChatRoom } from 'src/common/entities/chat-room.entity';

export class PostMatchingResponse extends PickType(ChatRoom, [
  'id',
  'fromUser',
  'toUser',
]) {}
