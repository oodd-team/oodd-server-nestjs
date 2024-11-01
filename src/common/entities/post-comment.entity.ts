import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Post } from './post.entity';
import { BaseEntity } from '../base.entity';

@Entity('PostComment')
export class PostComment extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  content!: string;

  @ManyToOne(() => User, (user) => user.postComments)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @ManyToOne(() => Post, (post) => post.postComments)
  @JoinColumn({ name: 'postId' })
  post!: Post;
}
