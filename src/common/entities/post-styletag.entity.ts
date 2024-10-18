import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Post } from './post.entity';
import { Styletag } from './styletag.entity';

@Entity('PostStyletag')
export class PostStyletag extends BaseEntity {
  @ManyToOne(() => Post, (post) => post.postStyletags)
  @JoinColumn({ name: 'postId' })
  post!: Post;

  @ManyToOne(() => Styletag, (styletag) => styletag.postStyletags)
  @JoinColumn({ name: 'styletagId' })
  styletag!: Styletag;
}
