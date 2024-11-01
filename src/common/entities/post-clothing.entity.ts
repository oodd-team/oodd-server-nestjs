import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Post } from './post.entity';
import { Clothing } from './clothing.entity';
import { BaseEntity } from '../base.entity';

@Entity('PostClothing')
export class PostClothing extends BaseEntity {
  @ManyToOne(() => Post, (post) => post.postClothings)
  @JoinColumn({ name: 'postId' })
  post!: Post;

  @ManyToOne(() => Clothing, (clothing) => clothing.postClothings)
  @JoinColumn({ name: 'clothingId' })
  clothing!: Clothing;
}
