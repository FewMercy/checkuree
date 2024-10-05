import { BaseTimeEntity } from '../../common/BaseTimeEntity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { AttendanceStatus } from '../const/record-type.enum';
import { DayType } from '../../schedules/const/day-type.enum';
import { Attendee } from '../../attendees/entities/attendee.entity';
import { LateTimeType } from '../const/late-time-type.enum';
import { AbsenceType } from '../const/absence-type.enum';
import { Schedule } from '../../schedules/entities/schedule.entity';

// TODO : date 형식 통일 및 주석 추가
/**
 * 출석 기록 엔티티
 *
 * 출석 대상의 출석 기록을 저장합니다.
 */
@Entity()
@Unique('UQ_RECORD', ['attendeeId', 'date', 'time'])
export class Record extends BaseTimeEntity {
  @PrimaryGeneratedColumn('increment', { comment: '출석 기록 PK', type: 'int' })
  @ApiProperty({ description: '출석 기록 PK', type: 'int' })
  id: number;

  @Column({ comment: '출석 대상 ID', type: 'varchar' })
  @ApiProperty({ description: '출석 대상 ID', type: 'string' })
  attendeeId: string;

  @Column({ comment: '출석 상태', type: 'varchar' })
  @ApiProperty({
    description: '출석 상태',
    type: 'enum',
    enum: AttendanceStatus,
  })
  status: AttendanceStatus;

  @Column({ comment: '출석 날짜 ex) 1993-11-17', type: 'varchar' })
  @ApiProperty({ description: '출석 날짜 ex) 1993-11-17', type: 'string' })
  date: string;

  @Column({ comment: '출석 시간 HHMM 형식', type: 'varchar', length: 4 })
  @ApiProperty({ description: '출석 시간 HHMM 형식', type: 'string' })
  time: string;

  @Column({ comment: '출석 요일 ( ex : MON/TUE/WED/THU/FRI/SAT/SUN )', type: 'varchar', length: 3 })
  @ApiProperty({
    description: '출석 요일',
    type: 'enum',
    enum: DayType,
  })
  day: DayType;

  @Column({ comment: '비고', type: 'varchar', nullable: true })
  @ApiProperty({ description: '비고', type: 'string', nullable: true })
  etc: string;

  @Column({ comment: '지각 시간', type: 'varchar', nullable: true })
  @ApiProperty({ description: '지각 시간', type: 'string', nullable: true })
  lateTime: LateTimeType;

  @Column({ comment: '결석 종류', type: 'varchar', nullable: true, default: null })
  @ApiProperty({ description: '결석 종류', type: 'string', nullable: true })
  absenceType: AbsenceType;

  @ManyToOne(() => Attendee, (attendee) => attendee.records)
  @JoinColumn({ name: 'attendeeId', referencedColumnName: 'id' })
  @ApiProperty({ type: () => Attendee })
  attendee: Attendee;

  @OneToOne(() => Schedule, (schedule: Schedule) => schedule.record, { nullable: true })
  @JoinColumn({ name: 'scheduleId', referencedColumnName: 'id' })
  @ApiProperty({ type: () => Schedule })
  schedule: Schedule;
}
