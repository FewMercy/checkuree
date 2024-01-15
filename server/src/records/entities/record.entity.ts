import { BaseTimeEntity } from '../../BaseTimeEntity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { AttendanceStatus } from '../record-type.enum';
import { DayType } from '../../schedules/const/day-type.enum';
import { Attendee } from '../../attendees/entities/attendee.entity';

@Entity()
export class Record extends BaseTimeEntity {
  @PrimaryGeneratedColumn('increment', { comment: '출석 기록 PK', type: 'int' })
  @ApiProperty({ description: '출석 기록 PK', type: 'int' })
  id: number;

  @Column({ comment: '출석 대상 ID', type: 'varchar' })
  @ApiProperty({ description: '출석 대상 ID', type: 'string' })
  attendeeId: string;

  @Column({ comment: '출석 상태', type: 'enum', enum: AttendanceStatus })
  @ApiProperty({
    description: '출석 상태',
    type: 'enum',
    enum: AttendanceStatus,
  })
  status: AttendanceStatus;

  @Column({ comment: '출석 날짜', type: 'datetime' })
  @ApiProperty({ description: '출석 날짜', type: 'datetime' })
  datetime: Date;

  @Column({ comment: '출석 요일', type: 'enum', enum: DayType })
  @ApiProperty({
    description: '출석 요일',
    type: 'enum',
    enum: DayType,
  })
  day: DayType;

  @Column({ comment: '지각사유', type: 'varchar', nullable: true })
  @ApiProperty({ description: '지각사유', type: 'string', nullable: true })
  lateReason: string;

  @ManyToOne(() => Attendee, (attendee) => attendee.records)
  @JoinColumn({ name: 'attendeeId', referencedColumnName: 'id' })
  @ApiProperty({ type: () => Attendee })
  attendee: Attendee;
}
