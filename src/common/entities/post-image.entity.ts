import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Post } from './post.entity';

@Entity('PostImage')
export class PostImage extends BaseEntity {
  @ManyToOne(() => Post, (post) => post.postImages)
  @JoinColumn({ name: 'postId' })
  post!: Post;

  @Column({ type: 'text' })
  url!: string;

  @Column({ type: 'bigint' })
  orderNum!: number;
}
