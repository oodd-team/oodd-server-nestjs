import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../base/baseEntity';
import { PostStyletag } from './postStyletagEntity';

@Entity('Styletag')
export class Styletag extends BaseEntity {
  @Column()
  tag!: string;

  @OneToMany(() => PostStyletag, postStyletag => postStyletag.styletag)
  postStyletags!: PostStyletag[];
}
