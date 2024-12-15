import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity('UserReport')
export class UserReport extends BaseEntity {
  @ManyToOne(() => User)
  @JoinColumn({ name: 'requesterId' })
  fromUser!: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'targetId' })
  toUser!: User;

  @Column({ type: 'varchar', length: 500 })
  reason!: string;
}
