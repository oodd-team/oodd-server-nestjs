import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { ChatMessage } from './chat-message.entity';
import { Matching } from './matching.entity';

@Entity('ChatRoom')
export class ChatRoom extends BaseEntity {
  @ManyToOne(() => User, (user) => user.sentChatRooms)
  @JoinColumn({ name: 'fromUserId' })
  fromUser!: User;

  @ManyToOne(() => User, (user) => user.receivedChatRooms)
  @JoinColumn({ name: 'toUserId' })
  toUser!: User;

  @ManyToOne(() => Matching, (matching) => matching.chatRooms)
  @JoinColumn({ name: 'matchingId' })
  matching!: Matching;

  @Column({ nullable: true, type: 'datetime' })
  toUserLeavedAt: Date = null;

  @Column({ nullable: true, type: 'datetime' })
  fromUserLeavedAt: Date = null;

  @Column({ type: 'enum', enum: ['pending', 'accepted', 'rejected'] })
  requestStatus: 'pending' | 'accepted' | 'rejected' = 'pending';

  @OneToMany(() => ChatMessage, (chatMessage) => chatMessage.chatRoom)
  chatMessages!: ChatMessage[];
}
