import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { ChatRoom } from './chat-room.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('Matching')
export class Matching extends BaseEntity {
  @ManyToOne(() => User, (user) => user.requestedMatchings)
  @JoinColumn({ name: 'requesterId' })
  @ApiProperty({ type: User, description: '매칭 요청자' })
  requester!: User;

  @ManyToOne(() => User, (user) => user.targetedMatchings)
  @JoinColumn({ name: 'targetId' })
  @ApiProperty({ type: User, description: '매칭 받는사람' })
  target!: User;

  @Column({ type: 'text' })
  @ApiProperty({
    description: '매칭 요청 메시지',
    example: '매칭 요청 합니다.',
  })
  message!: string;

  @Column({ type: 'enum', enum: ['pending', 'accepted', 'rejected'] })
  @ApiProperty({
    enum: ['pending', 'accepted', 'rejected'],
    description: '매칭 상태',
    example: 'pending',
  })
  requestStatus: 'pending' | 'accepted' | 'rejected' = 'pending';

  @Column({ type: 'datetime', nullable: true })
  rejectedAt: Date = null;

  @Column({ type: 'datetime', nullable: true })
  acceptedAt: Date = null;

  @OneToMany(() => ChatRoom, (chatRoom) => chatRoom.matching)
  chatRooms!: ChatRoom[];
}
