import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { BaseEntity } from '../base.entity';
import { Post } from './post.entity';

@Entity('PostReport')
export class PostReport extends BaseEntity {
  @ManyToOne(() => User, (user) => user.postReports)
  @JoinColumn({ name: 'requesterId' })
  reporter!: User;

  @ManyToOne(() => Post, (post) => post.postReports)
  @JoinColumn({ name: 'postId' })
  post!: Post;

  @Column({ type: 'varchar', length: 100 })
  reason!: string;
}
