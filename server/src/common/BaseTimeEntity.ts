import { Column, CreateDateColumn, DeleteDateColumn, Entity, UpdateDateColumn } from 'typeorm';

@Entity()
export abstract class BaseTimeEntity {
  @Column({ select: false })
  createId: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Column({ nullable: true, select: false })
  updateId: string;

  @UpdateDateColumn({ nullable: true, select: false })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true, select: false })
  deletedAt: Date;
}
