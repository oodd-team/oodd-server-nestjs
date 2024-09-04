import {Entity, ManyToOne, Unique} from 'typeorm';
import {BaseEntity} from '../base/baseEntity';
import {User} from './userEntity';
import {Post} from './postEntity';

@Entity('Like')
@Unique(['user', 'post']) // 'userId'와 'postId' 대신 'user'와 'post'로 유니크 설정
export class Like extends BaseEntity {
  @ManyToOne(() => Post, post => post.likes)
  post!: Post;

  @ManyToOne(() => User, user => user.likes)
  user!: User;
}
