import {Entity, Column, OneToMany, ManyToOne} from 'typeorm';
import {BaseEntity} from '../base/baseEntity';
import {PostStyletag} from './postStyletagEntity';
import {User} from './userEntity';

@Entity('UserRelationship')
export class UserRelationship extends BaseEntity {
  @ManyToOne(() => User, user => user.requestedUserRelationships)
  requester!: User;

  @ManyToOne(() => User, user => user.targetedUserRelationships)
  target!: User;

  @Column({type: 'text'})
  message!: string;

  @Column({type: 'enum', enum: ['pending', 'accepted', 'rejected']})
  requestStatus!: 'pending' | 'accepted' | 'rejected';

  @Column({type: 'datetime', nullable: true})
  rejectedAt!: Date;

  @Column({type: 'datetime', nullable: true})
  acceptedAt!: Date;
}
