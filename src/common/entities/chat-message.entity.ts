import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './userEntity';
import { ChatRoom } from './chat-room.entity';
import { BaseEntity } from '../base.entity';

@Entity('ChatMessage')
export class ChatMessage extends BaseEntity {
  @ManyToOne(() => ChatRoom, (chatRoom) => chatRoom.chatMessages)
  @JoinColumn({ name: 'chatRoomId' })
  chatRoom!: ChatRoom;

  @ManyToOne(() => User, (user) => user.sentChatRooms)
  @JoinColumn({ name: 'fromUserId' })
  fromUser!: User;

  @ManyToOne(() => User, (user) => user.receivedChatRooms)
  @JoinColumn({ name: 'toUserId' })
  toUser!: User;

  @Column('text')
  content!: string;

  @Column('datetime')
  toUserReadAt?: Date | null;
}
