import { ApiProperty } from '@nestjs/swagger';

export class PostMatchingResponse {
  @ApiProperty({ example: 1, description: '채팅방 아이디' })
  chatRoomId: number;

  @ApiProperty({ example: 1, description: '신청한 유저 아이디' })
  fromUserId: number;

  @ApiProperty({ example: 2, description: '매칭 상대 유저 아이디' })
  toUserId: number;
}
