import { ApiOperation } from '@nestjs/swagger';

// 채팅방 리스트 조회 API Swagger
export function GetChatRoomsSwagger(apiSummary: string) {
  return ApiOperation({ summary: apiSummary });
}

// 채팅방 나가기 API Swagger
export function LeaveChatRoomSwagger(apiSummary: string) {
  return ApiOperation({ summary: apiSummary });
}
