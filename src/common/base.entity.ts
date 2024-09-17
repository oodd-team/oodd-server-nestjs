import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ default: 'activated' })
  status!: 'activated' | 'deactivated';

  @CreateDateColumn({ type: 'datetime' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'datetime', nullable: true })
  updatedAt!: Date | null;

  @Column({ type: 'datetime', nullable: true })
  deletedAt!: Date | null;
}
