import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';

export class BaseEntity {
  //export abstract class BaseEnity - abstract 사용하면 인스턴스 생성X
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ default: 'activated' })
  status!: 'activated' | 'deactivated';

  @CreateDateColumn({ type: 'datetime' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'datetime', nullable: true })
  updatedAt?: Date;

  @Column({ type: 'datetime', nullable: true })
  deletedAt?: Date | null;
}
