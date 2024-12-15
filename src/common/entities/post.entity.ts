import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { BaseEntity } from '../base.entity';
import { PostComment } from './post-comment.entity';
import { PostImage } from './post-image.entity';
import { PostLike } from './post-like.entity';
import { PostStyletag } from './post-styletag.entity';
import { PostClothing } from './post-clothing.entity';
import { PostReport } from './post-report.entity';
@Entity('Post')
export class Post extends BaseEntity {
  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column({ type: 'varchar', length: 100 })
  content!: string;

  @Column({ type: 'boolean', default: false })
  isRepresentative!: boolean;

  // one to many
  @OneToMany(() => PostComment, (postComment) => postComment.post)
  postComments!: PostComment[];

  @OneToMany(() => PostImage, (postImage) => postImage.post)
  postImages!: PostImage[];

  @OneToMany(() => PostLike, (postLike) => postLike.post)
  postLikes!: PostLike[];

  @OneToMany(() => PostStyletag, (postStyletag) => postStyletag.post)
  postStyletags!: PostStyletag[];

  @OneToMany(() => PostClothing, (postClothing) => postClothing.post)
  postClothings!: PostClothing[];

  @OneToMany(() => PostReport, (postReport) => postReport.post)
  postReports!: PostReport[];

  images: string[];

  // 댓글 수
  get commentCount(): number {
    return this.postComments ? this.postComments.length : 0;
  }

  // Like 수
  get likeCount(): number {
    return this.postLikes ? this.postLikes.length : 0;
  }
}
