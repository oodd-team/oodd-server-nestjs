import { Entity, OneToMany, Column } from 'typeorm';
import { BaseEntity } from '../base/baseEntity';
import { Post } from './postEntity';
import { Comment } from './comment.entity';
import { ChatRoom } from './chat-room.entity';
import { UserRelationship } from './userRelationshipEntity';
import { Like } from './likeEntity';
import { InterestFriend } from './interestFriendEntity';

@Entity('User') // 데이터베이스 테이블과 매핑되는 엔티티
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 255, nullable: true })
  kakaoId!: string | null; // 카카오 고유 ID를 저장하는 필드

  @Column({ type: 'varchar', length: 255, nullable: true })
  googleId!: string | null; // 구글 고유 ID를 저장하는 필드

  @Column({ type: 'varchar', length: 255, nullable: true })
  naverId!: string | null; // 네이버 고유 ID를 저장하는 필드

  @Column({ length: 100 })
  name!: string;

  @Column({ length: 100 })
  email!: string;

  @Column({ length: 100 })
  nickname!: string;

  @Column({ length: 15 })
  phoneNumber!: string;

  @Column({ length: 255 })
  profilePictureUrl!: string;

  @Column('text')
  bio!: string;

  @Column('datetime')
  joinedAt!: Date; // joinedAt는 datetime 타입

  @OneToMany(() => Post, (post) => post.user)
  posts!: Post[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments!: Comment[];

  @OneToMany(() => ChatRoom, (chatRoom) => chatRoom.toUser)
  receivedChatRooms?: ChatRoom[];

  @OneToMany(() => ChatRoom, (chatRoom) => chatRoom.fromUser)
  sentChatRooms?: ChatRoom[];

  @OneToMany(
    () => UserRelationship,
    (userRelationship) => userRelationship.requester,
  )
  requestedUserRelationships?: UserRelationship[];

  @OneToMany(
    () => UserRelationship,
    (userRelationship) => userRelationship.target,
  )
  targetedUserRelationships?: UserRelationship[];

  @OneToMany(() => Like, (like) => like.user)
  likes!: Like[];

  @OneToMany(() => InterestFriend, (interestFriend) => interestFriend.sender)
  sentInterests!: InterestFriend[];

  @OneToMany(() => InterestFriend, (interestFriend) => interestFriend.receiver)
  receivedInterests!: InterestFriend[];

  // 대표 게시물 필드 추가
  representativePost?: Post | null;
}
