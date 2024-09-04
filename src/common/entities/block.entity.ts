import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './userEntity';
import { BaseEntity } from '../base.entity';

@Entity('UserBlock')
export class UserBlock extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'requesterId' })
  requester!: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'targetId' })
  target!: User;
}
