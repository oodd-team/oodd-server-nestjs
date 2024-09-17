import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { PostClothing } from './post-clothing.entity';

@Entity('Clothing')
export class Clothing extends BaseEntity {
  @Column({ type: 'text', nullable: true })
  imageUrl!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  brandName!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  modelName!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  modelNumber!: string;

  @Column({ type: 'text', nullable: true })
  url!: string;

  @OneToMany(() => PostClothing, (postClothing) => postClothing.clothing)
  postClothings!: PostClothing[];
}
