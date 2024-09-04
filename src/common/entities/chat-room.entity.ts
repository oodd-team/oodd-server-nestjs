import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { User } from './userEntity';
import { ChatMessage } from './chat-message.entity';

@Entity('ChatRoom')
export class ChatRoom extends BaseEntity {
  @ManyToOne(() => User, (user) => user.sentChatRooms)
  @JoinColumn({ name: 'fromUserId' })
  fromUser!: User;

  @ManyToOne(() => User, (user) => user.receivedChatRooms)
  @JoinColumn({ name: 'toUserId' })
  toUser!: User;

  @Column({ nullable: true, type: 'datetime' })
  toUserLeavedAt?: Date;

  @Column({ nullable: true, type: 'datetime' })
  fromUserLeavedAt?: Date;

  @Column({ type: 'enum', enum: ['pending', 'accepted', 'rejected'] })
  requestStatus!: 'pending' | 'accepted' | 'rejected';

  @OneToMany(() => ChatMessage, (chatMessage) => chatMessage.chatRoom)
  chatMessages?: ChatMessage[];
}
