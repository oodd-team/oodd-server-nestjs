import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Post } from './postEntity';
import { Clothing } from './clothing.entity';
import { BaseEntity } from '../base/baseEntity';

@Entity('PostClothing')
export class PostClothing extends BaseEntity {
  @ManyToOne(() => Post, (post) => post.postClothings)
  post!: Post;

  @ManyToOne(() => Clothing, (clothing) => clothing.postClothings)
  clothing!: Clothing;
}
