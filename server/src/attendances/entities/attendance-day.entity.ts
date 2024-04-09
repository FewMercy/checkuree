import { BaseTimeEntity } from '../../common/BaseTimeEntity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Attendance } from './attendance.entity';
import { DayType } from '../../schedules/const/day-type.enum';

@Entity()
export class AttendanceDay {
  @PrimaryGeneratedColumn('increment')
  @ApiProperty({ description: '출석부 요일 PK', type: 'number' })
  id: number;

  @Column({ comment: '출석부 번호', type: 'varchar' })
  @ApiProperty({ description: '출석부 번호', type: 'string' })
  attendanceId: string;

  @Column({ comment: '출석부 요일', type: 'varchar' })
  @ApiProperty({ description: '출석부 요일', type: 'enum', enum: DayType })
  day: DayType;

  @ManyToOne(() => Attendance, (attendance) => attendance.attendanceDays)
  @JoinColumn({ name: 'attendanceId', referencedColumnName: 'id' })
  @ApiProperty({ type: () => Attendance })
  attendance: Attendance;
}
