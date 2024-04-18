import { BaseTimeEntity } from '../../common/BaseTimeEntity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { AttendanceStatus } from '../const/record-type.enum';
import { DayType } from '../../schedules/const/day-type.enum';
import { Attendee } from '../../attendees/entities/attendee.entity';
import { LateTimeType } from '../const/late-time-type.enum';
import { AbsenceType } from '../const/absence-type.enum';

// 출석 체크 방법
//
@Entity()
@Unique(['attendeeId', 'date'])
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

  @Column({ comment: '출석 날짜', type: 'varchar' })
  @ApiProperty({ description: '출석 날짜', type: 'string' })
  date: string;

  @Column({ comment: '출석 요일', type: 'enum', enum: DayType })
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
}
