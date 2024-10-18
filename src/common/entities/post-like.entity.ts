import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Post } from './post.entity';

@Entity('PostLike')
export class PostLike extends BaseEntity {
  @ManyToOne(() => Post, (post) => post.postLikes)
  @JoinColumn({ name: 'postId' })
  post!: Post;

  @ManyToOne(() => User, (user) => user.postLikes)
  @JoinColumn({ name: 'userId' })
  user!: User;
}
