import {Entity, Column, ManyToOne, JoinColumn} from 'typeorm';
import {User} from './userEntity';
import {BaseEntity} from '../base/baseEntity';
import {Post} from './postEntity';

@Entity('Report')
export class Report extends BaseEntity {
  @ManyToOne(() => User)
  @JoinColumn({name: 'reporterId'})
  reporter!: User;

  @ManyToOne(() => Post)
  @JoinColumn({name: 'postId'})
  post!: Post;

  @Column({type: 'varchar', length: 500})
  reason!: string;
}
