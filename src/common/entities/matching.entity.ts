import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { ChatRoom } from './chat-room.entity';

@Entity('Matching')
export class Matching extends BaseEntity {
  @ManyToOne(() => User, (user) => user.requestedMatchings)
  @JoinColumn({ name: 'requesterId' })
  requester!: User;

  @ManyToOne(() => User, (user) => user.targetedMatchings)
  @JoinColumn({ name: 'targetId' })
  target!: User;

  @Column({ type: 'text' })
  message!: string;

  @Column({ type: 'enum', enum: ['pending', 'accepted', 'rejected'] })
  requestStatus: 'pending' | 'accepted' | 'rejected' = 'pending';

  @Column({ type: 'datetime', nullable: true })
  rejectedAt: Date = null;

  @Column({ type: 'datetime', nullable: true })
  acceptedAt: Date = null;

  @OneToMany(() => ChatRoom, (chatRoom) => chatRoom.matching)
  chatRooms!: ChatRoom[];
}
