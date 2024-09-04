import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base/baseEntity';
import { Post } from './postEntity';
import { Styletag } from './styletagEntity';

@Entity('PostStyletag')
export class PostStyletag extends BaseEntity {
  @ManyToOne(() => Post, post => post.postStyletags)
  post!: Post;

  @ManyToOne(() => Styletag, styletag => styletag.postStyletags)
  styletag!: Styletag;
}
