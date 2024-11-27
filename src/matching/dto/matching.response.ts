import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class PostMatchingResponse {
  @ApiProperty({ example: 1, description: '채팅방 아이디' })
  chatRoomId: number;

  @ApiProperty({ example: 1, description: '신청한 유저 아이디' })
  fromUserId: number;

  @ApiProperty({ example: 2, description: '매칭 상대 유저 아이디' })
  toUserId: number;
}

export class PatchMatchingResponse {
  @ApiProperty({ example: 1, description: '매칭 ID' })
  matchingId: number;

  @ApiProperty({ example: 1, description: '신청한 유저 아이디' })
  requesterId: number;

  @ApiProperty({ example: 2, description: '매칭 상대 유저 아이디' })
  targetId: number;

  @ApiProperty({
    example: 'accept',
    enum: ['accept', 'reject', 'pending'],
    description: '수락 또는 거절',
  })
  requestStatus: 'accept' | 'reject' | 'pending';

  @ApiProperty({ example: 1, description: '채팅방 아이디' })
  chatRoomId?: number;
}

class RequesterResponse {
  @ApiProperty({
    description: '매칭 요청자의 ID',
    example: '19',
  })
  requesterId: number;

  @ApiProperty({
    description: '매칭 요청자의 닉네임',
    example: '1d1d1d',
  })
  nickname: string;

  @ApiProperty({
    description: '매칭 요청자의 프로필 이미지 url',
    example: 'https://example.com/image1.jpg',
  })
  profilePictureUrl: string;
}

class RequesterPostResponse {
  @ApiProperty({
    description: '매칭 요청자의 게시물 이미지 목록',
    type: [String],
    example: [
      { url: 'https://example.com/image1.jpg', orderNum: 1 },
      { url: 'https://example.com/image2.jpg', orderNum: 2 },
    ],
  })
  postImages: { url: string; orderNum: number }[];

  @ApiProperty({
    description: '매칭 요청자의 게시물 스타일 태그 목록',
    type: [String],
    example: ['classic', 'basic'],
  })
  styleTags: string[];
}

class MatchingResponse {
  @ApiProperty({ example: 1, description: '매칭 ID' })
  matchingId: number;

  @ApiProperty({
    description: '매칭 요청자 정보',
    type: RequesterResponse,
  })
  @Type(() => RequesterResponse)
  requester: RequesterResponse;

  @ApiProperty({
    description: '매칭 요청자의 대표 게시물이 없을 경우, 가장 최근 게시물 정보',
    type: RequesterPostResponse,
  })
  @Type(() => RequesterPostResponse)
  requesterPost: RequesterPostResponse;
}

export class GetMatchingsResponse {
  @ApiProperty({
    description: '매칭 존재 여부',
    example: true,
  })
  isMatching: boolean;

  @ApiProperty({
    description: '받은 매칭 수',
    example: 10,
  })
  matchingsCount: number;

  @ApiProperty({
    description: '매칭 정보',
    type: [MatchingResponse],
  })
  @Type(() => MatchingResponse)
  matching: MatchingResponse[];
}
