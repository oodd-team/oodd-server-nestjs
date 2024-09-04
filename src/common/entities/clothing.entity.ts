import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { PostClothing } from './postClothingEntity';

@Entity('Clothing')
export class Clothing extends BaseEntity {
  @OneToMany(() => PostClothing, (postClothing) => postClothing.clothing)
  postClothings!: PostClothing[];

  @Column()
  imageUrl!: string;

  @Column()
  brandName!: string;

  @Column()
  modelName!: string;

  @Column()
  modelNumber!: string;

  @Column()
  url!: string;
}
