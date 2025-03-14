import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { PostStyletag } from './post-styletag.entity';
import { UserStyletag } from './user-styletag.entity';

@Entity('Styletag')
export class Styletag extends BaseEntity {
  @Column({ type: 'varchar', length: 20 })
  tag!: string;

  @OneToMany(() => PostStyletag, (postStyletag) => postStyletag.styletag)
  postStyletags!: PostStyletag[];

  @OneToMany(() => UserStyletag, (userStyletag) => userStyletag.styletag)
  userStyletags!: UserStyletag[];
}
