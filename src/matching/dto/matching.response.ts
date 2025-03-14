import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { MatchingRequestStatusEnum } from 'src/common/enum/matchingRequestStatus';

export class PatchMatchingResponse {
  @ApiProperty({ example: 1, description: '매칭 ID' })
  id: number;

  @ApiProperty({ example: 1, description: '신청한 유저 아이디' })
  requesterId: number;

  @ApiProperty({ example: 2, description: '매칭 상대 유저 아이디' })
  targetId: number;

  @ApiProperty({
    example: 'accepted',
    enum: ['accepted', 'rejected', 'pending'],
    description: '수락 또는 거절',
  })
  requestStatus: 'accepted' | 'rejected' | 'pending';

  @ApiProperty({ example: 1, description: '채팅방 아이디' })
  chatRoomId?: number;
}

class RepresentativePost {
  @ApiProperty({
    description: '매칭 요청자의 게시물 이미지 목록',
    type: [String],
    example: [
      { url: 'https://example.com/image1.jpg', orderNum: 1 },
      { url: 'https://example.com/image2.jpg', orderNum: 2 },
    ],
  })
  postImages?: { url: string; orderNum: number }[];

  @ApiProperty({
    description: '매칭 요청자의 게시물 스타일 태그 목록',
    type: [String],
    example: ['classic', 'basic'],
  })
  styleTags?: string[];
}
class RequesterResponse {
  @ApiProperty({
    description: '매칭 요청자의 ID',
    example: 19,
  })
  id: number;

  @ApiProperty({
    description: '매칭 요청자의 닉네임',
    example: '러러',
  })
  nickname: string;

  @ApiProperty({
    description: '매칭 요청자의 프로필 이미지 url',
    example: 'https://example.com/image1.jpg',
  })
  profilePictureUrl: string;

  @ApiProperty({
    description: '매칭 요청자의 대표 게시물이 없을 경우, 가장 최근 게시물 정보',
    type: RepresentativePost,
  })
  @Type(() => RepresentativePost)
  representativePost?: RepresentativePost;
}

export class MatchingResponse {
  @ApiProperty({ example: 1, description: '매칭 ID' })
  id: number;

  @ApiProperty({
    description: '매칭 요청자 정보',
    type: RequesterResponse,
  })
  @Type(() => RequesterResponse)
  requester: RequesterResponse;
}

export class CreateMatchingResponse {
  @ApiProperty({ example: 1, description: '매칭 ID' })
  id: number;

  @ApiProperty({
    description: '매칭 요청 메시지',
    example: '안녕하세요! 매칭 요청합니다.',
  })
  message: string;

  @ApiProperty({ example: 1, description: '채팅방 아이디' })
  chatRoomId?: number;

  @ApiProperty({
    example: '2024-10-11T09:00:00.000Z',
    description: '신청 시각',
  })
  createdAt: string;

  @ApiProperty({ example: 2, description: '매칭 상대 유저 아이디' })
  targetId: number;

  @ApiProperty({
    description: '매칭 요청자 정보',
    type: RequesterResponse,
  })
  @Type(() => RequesterResponse)
  requester: RequesterResponse;
}

export class GetMatchingsResponse {
  @ApiProperty({
    description: '매칭 정보',
    type: [MatchingResponse],
  })
  @Type(() => MatchingResponse)
  matching: MatchingResponse[];
}

export class GetOneMatchingResponse extends OmitType(PatchMatchingResponse, [
  'chatRoomId',
] as const) {
  @ApiProperty({
    example: '2024-10-11T09:00:00.000Z',
    description: '신청 시각',
  })
  createdAt: string;
}

export interface MatchingRequest {
  id: number;
  message: string;
  createdAt: string;
  requestStatus: MatchingRequestStatusEnum;
  chatRoomId: number;
  targetId: number;
  requester: {
    id: number;
    nickname: string;
    profilePictureUrl: string;
    representativePost?: {
      postImages: { url: string; orderNum: number }[];
      styleTags: string[];
    };
  };
}
