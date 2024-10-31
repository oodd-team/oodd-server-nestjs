import { Entity, OneToMany, Column } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { Post } from './post.entity';
import { PostComment } from './post-comment.entity';
import { ChatRoom } from './chat-room.entity';
import { Matching } from './matching.entity';
import { PostLike } from './post-like.entity';
import { PostReport } from './post-report.entity';
import { ChatMessage } from './chat-message.entity';

@Entity('User')
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 100, nullable: true })
  kakaoId!: string | null; // 카카오 고유 ID를 저장하는 필드

  @Column({ type: 'varchar', length: 100, nullable: true })
  googleId!: string | null; // 구글 고유 ID를 저장하는 필드

  @Column({ type: 'varchar', length: 100, nullable: true })
  naverId!: string | null; // 네이버 고유 ID를 저장하는 필드

  @Column({ type: 'varchar', length: 100, nullable: true })
  name!: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  email!: string | null;

  @Column({ type: 'varchar', length: 10, nullable: true })
  nickname!: string | null;

  @Column({ type: 'varchar', length: 15, nullable: true })
  phoneNumber!: string | null;

  @Column({ type: 'text', nullable: true })
  profilePictureUrl!: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  bio!: string | null;

  @Column('datetime')
  joinedAt!: Date; // joinedAt는 datetime 타입

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
  representativePost?: Post | null;
}
