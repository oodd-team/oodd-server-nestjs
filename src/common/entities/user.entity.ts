import { Entity, OneToMany, Column, OneToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Post } from './post.entity';
import { PostComment } from './post-comment.entity';
import { ChatRoom } from './chat-room.entity';
import { Matching } from './matching.entity';
import { PostLike } from './post-like.entity';
import { PostReport } from './post-report.entity';
import { ChatMessage } from './chat-message.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('User')
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 100, nullable: true })
  @ApiProperty({ description: '카카오 고유 ID', example: '1234567890' })
  kakaoId!: string | null; // 카카오 고유 ID를 저장하는 필드

  @ApiProperty({ description: '네이버 고유 ID', example: '1234567890' })
  @Column({ type: 'varchar', length: 100, nullable: true })
  naverId!: string | null; // 네이버 고유 ID를 저장하는 필드

  @ApiProperty({ description: '이름', example: '홍길동' })
  @Column({ type: 'varchar', length: 100, nullable: true })
  name!: string | null;

  @ApiProperty({ description: '이메일', example: 'limms1217@naver.com' })
  @Column({ type: 'varchar', length: 100, nullable: true })
  email!: string | null;

  @ApiProperty({ description: '닉네임', example: '마이콜' })
  @Column({ type: 'varchar', length: 10, nullable: true })
  nickname!: string | null;

  @ApiProperty({ description: '전화번호', example: '010-1234-5678' })
  @Column({ type: 'varchar', length: 15, nullable: true })
  phoneNumber!: string | null;

  @ApiProperty({
    description: '프로필 사진 URL',
    example: 'https://naver.com/profile.jpg',
  })
  @Column({ type: 'text', nullable: true })
  profilePictureUrl!: string | null;

  @ApiProperty({ description: '자기소개', example: '안녕하세요' })
  @Column({ type: 'varchar', length: 100, nullable: true })
  bio!: string | null;

  @ApiProperty({ description: '회원가입 시각', example: '2021-08-01 00:00:00' })
  @Column('datetime')
  joinedAt!: Date; // joinedAt는 datetime 타입

  @ApiProperty({
    description: '이용약관 동의 시각',
    example: '2021-08-01 00:00:00',
  })
  @Column('datetime')
  privateTermAcceptedAt!: Date;

  //one to many 관계 설정

  @OneToMany(() => Post, (post) => post.user)
  posts!: Post[];

  @OneToMany(() => PostComment, (postComment) => postComment.user)
  postComments!: PostComment[];

  @OneToMany(() => ChatRoom, (chatRoom) => chatRoom.toUser)
  receivedChatRooms?: ChatRoom[];

  @OneToMany(() => ChatRoom, (chatRoom) => chatRoom.fromUser)
  sentChatRooms?: ChatRoom[];

  @OneToMany(() => ChatMessage, (chatMessage) => chatMessage.toUser)
  receivedChatMessages?: ChatMessage[];

  @OneToMany(() => ChatMessage, (chatMessage) => chatMessage.fromUser)
  sentChatMessages?: ChatMessage[];

  @OneToMany(() => Matching, (matching) => matching.requester)
  requestedMatchings?: Matching[];

  @OneToMany(() => Matching, (matching) => matching.target)
  targetedMatchings?: Matching[];

  @OneToMany(() => PostLike, (postLike) => postLike.user)
  postLikes!: PostLike[];

  @OneToMany(() => PostReport, (postReport) => postReport.reporter)
  postReports!: PostReport[];

  // 대표 게시물 필드 추가
  @OneToOne(() => Post, (post) => post.user)
  representativePost?: Post | null;
}
