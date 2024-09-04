import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from './userEntity';
import { Like } from './likeEntity';
import { Comment } from './comment.entity';
import { PostStyletag } from './postStyletagEntity';
import { Clothing } from './clothing.entity';
import { Image } from './imageEntity';
import { BaseEntity } from '../base/baseEntity';
import { PostClothing } from './postClothingEntity';

@Entity('Post')
export class Post extends BaseEntity {
  @ManyToOne(() => User, (user) => user.posts)
  user!: User;

  @Column('text')
  content!: string;

  @Column()
  isRepresentative!: boolean;

  @OneToMany(() => Like, (like) => like.post, { cascade: true })
  likes!: Like[];

  @OneToMany(() => Comment, (comment) => comment.post, { cascade: true })
  comments!: Comment[];

  @OneToMany(() => PostStyletag, (postStyletag) => postStyletag.post, {
    cascade: true,
  })
  postStyletags!: PostStyletag[];

  // @OneToMany(() => Clothing, clothing => clothing.post, { cascade: true })
  // clothings!: Clothing[];

  @OneToMany(() => PostClothing, (postClothing) => postClothing.post, {
    cascade: true,
  })
  postClothings!: PostClothing[];

  @OneToMany(() => Image, (image) => image.post, { cascade: true })
  images!: Image[];
}
