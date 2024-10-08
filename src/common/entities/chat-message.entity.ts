import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { ChatRoom } from './chat-room.entity';
import { BaseEntity } from './base.entity';

@Entity('ChatMessage')
export class ChatMessage extends BaseEntity {
  @ManyToOne(() => ChatRoom, (chatRoom) => chatRoom.chatMessages)
  @JoinColumn({ name: 'chatRoomId' })
  chatRoom!: ChatRoom;

  @ManyToOne(() => User, (user) => user.sentChatMessages)
  @JoinColumn({ name: 'fromUserId' })
  fromUser!: User;

  @ManyToOne(() => User, (user) => user.receivedChatMessages)
  @JoinColumn({ name: 'toUserId' })
  toUser!: User;

  @Column({ type: 'text' })
  content!: string;

  @Column({ type: 'datetime', nullable: true })
  toUserReadAt: Date | null = null;
}
