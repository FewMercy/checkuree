import { BaseTimeEntity } from '../../common/BaseTimeEntity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { AttendanceType } from '../const/attendance-type.enum';
import { UserAttendance } from './user-attendance.entity';
import { Attendee } from '../../attendees/entities/attendee.entity';
import { AttendanceDay } from './attendance-day.entity';

@Entity()
export class Attendance extends BaseTimeEntity {
  @PrimaryGeneratedColumn('uuid', { comment: '출석부 번호' })
  @ApiProperty({ description: '출석부 번호' })
  id: string;

  @Column({ comment: '출석부 제목', type: 'varchar' })
  @ApiProperty({ description: '출석부 제목', type: 'string' })
  title: string;

  @Column({ comment: '출석부 설명', type: 'varchar', nullable: true })
  @ApiProperty({ description: '출석부 설명', type: 'string' })
  description: string;

  @Column({ comment: '출석부 사용 시작 시간', type: 'varchar', nullable: false })
  @ApiProperty({ description: '출석부 사용 시작 시간', type: 'string', example: '1200' })
  availableFrom: string;

  @Column({ comment: '출석부 사용 종료 시간', type: 'varchar', nullable: false })
  @ApiProperty({ description: '출석부 사용 종료 시간', type: 'string', example: '2000' })
  availableTo: string;

  @Column({ comment: '지각 상태 사용 유무', type: 'boolean', default: true })
  @ApiProperty({ description: '지각 상태 사용 유무', type: 'boolean' })
  allowLateness: boolean;

  @OneToMany(() => UserAttendance, (userAttendance) => userAttendance.attendance)
  @ApiProperty({ type: () => UserAttendance })
  userAttendance: UserAttendance[];

  @OneToMany(() => Attendee, (attendee) => attendee.attendance)
  @ApiProperty({ type: () => Attendee })
  attendees: Attendee[];

  @OneToMany(() => AttendanceDay, (attendanceDay) => attendanceDay.attendance)
  @ApiProperty({ type: () => UserAttendance })
  attendanceDays: AttendanceDay[];
}
