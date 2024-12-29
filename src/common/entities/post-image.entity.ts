import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Post } from './post.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('PostImage')
export class PostImage extends BaseEntity {
  @ManyToOne(() => Post, (post) => post.postImages)
  @JoinColumn({ name: 'postId' })
  post!: Post;

  @ApiProperty({
    example: 'http://imageurl.example',
    description: '게시글 이미지 URL',
  })
  @Column({ type: 'text' })
  url!: string;

  @ApiProperty({ example: 1, description: '게시글 이미지 순서' })
  @Column({ type: 'bigint' })
  orderNum!: number;
}
