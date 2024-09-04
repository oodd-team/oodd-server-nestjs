import {Entity, Column, ManyToOne, JoinColumn} from 'typeorm';
import {BaseEntity} from '../base/baseEntity';
import {Post} from './postEntity';

@Entity('Image')
export class Image extends BaseEntity {
  @Column()
  postId!: number;

  @ManyToOne(() => Post, post => post.images)
  post!: Post;

  @Column()
  url!: string;

  @Column()
  order!: number;
}