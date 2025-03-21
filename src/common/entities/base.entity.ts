import dayjs from 'dayjs';
import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  DeleteDateColumn,
  BeforeUpdate,
} from 'typeorm';
import { StatusEnum } from '../enum/entityStatus';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: 'enum',
    enum: StatusEnum,
    default: StatusEnum.ACTIVATED,
  })
  status!: StatusEnum;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'datetime', nullable: true })
  updatedAt!: Date | null;

  @DeleteDateColumn({ type: 'datetime', nullable: true })
  deletedAt!: Date | null;

  @BeforeUpdate()
  setUpdatedAt() {
    this.updatedAt = dayjs().toDate(); // 업데이트 시 현재 날짜로 설정
  }

  softDelete() {
    this.deletedAt = dayjs().toDate(); // 삭제 시 현재 날짜로 설정
  }

  restore() {
    this.deletedAt = null; // 복원 시 deletedAt을 null로 설정
  }
}
