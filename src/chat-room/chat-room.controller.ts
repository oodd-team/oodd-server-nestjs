import { Controller, Get, Patch } from '@nestjs/common';
import { ChatRoomService } from './chat-room.service';
import { GetChatRoomsSwagger, LeaveChatRoomSwagger } from './chat-room.swagger';

@Controller('chat-room')
export class ChatRoomController {
  constructor(private readonly chatRoomService: ChatRoomService) {}
  @Get()
  @GetChatRoomsSwagger('채팅방 리스트 조회 API')
  getChatRooms() {
    // return this.userService.getHello();
  }

  @Patch()
  @LeaveChatRoomSwagger('채팅방 나가기 API')
  leaveChatRoom() {
    // return this.userService.getHello();
  }
}
