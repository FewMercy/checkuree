import { BaseTimeEntity } from '../../common/BaseTimeEntity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Attendance } from '../../attendances/entities/attendance.entity';
import { Schedule } from '../../schedules/entities/schedule.entity';
import { Record } from '../../records/entities/record.entity';
import { AttendeeGrade } from '../const/grade.enum';
import { Gender } from '../const/gender.enum';

@Entity()
export class Attendee extends BaseTimeEntity {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: '출석체크 대상 번호' })
  id: string;

  @Column({ comment: '소속 출석부 ID', type: 'varchar' })
  @ApiProperty({ description: '소속 출석부 ID', type: 'string' })
  attendanceId: string;

  @Column({ comment: '출석 대상자 이름', type: 'varchar' })
  @ApiProperty({ description: '출석 대상자 이름', type: 'string' })
  name: string;

  @Column({ comment: '출석 대상자 성별', type: 'varchar' })
  @ApiProperty({ description: '출석 대상자 성별', type: 'enum', enum: Gender })
  gender: Gender;

  @Column({ comment: '출석 대상자 전화번호', type: 'varchar', nullable: true })
  @ApiProperty({ description: '출석 대상자 전화번호', type: 'string' })
  mobileNumber: string;

  @Column({
    comment: '출석 대상자 비상 전화번호',
    type: 'varchar',
    nullable: true,
  })
  @ApiProperty({ description: '출석 대상자 비상 전화번호', type: 'string' })
  subMobileNumber: string;

  @Column({ comment: '출석 대상자 생년월일', type: 'varchar', nullable: true })
  @ApiProperty({ description: '출석 대상자 생년월일', type: 'string' })
  birth?: string;

  @Column({ comment: '출석 대상자 과정', type: 'varchar', nullable: true })
  @ApiProperty({ description: '출석 대상자 과정', type: 'string' })
  course?: string;

  @Column({ comment: '출석 대상자 학교', type: 'varchar', nullable: true })
  @ApiProperty({ description: '출석 대상자 학교', type: 'string' })
  school?: string;

  @Column({ comment: '출석 대상자 학년', type: 'varchar', nullable: true })
  @ApiProperty({ description: '출석 대상자 학년', type: 'enum', enum: AttendeeGrade, example: AttendeeGrade.초등3학년 })
  grade?: AttendeeGrade;

  @Column({ comment: '출석 대상자 설명', type: 'varchar', nullable: true })
  @ApiProperty({ description: '출석 대상자 설명', type: 'string' })
  description: string;

  @ManyToOne(() => Attendance, (attendance) => attendance.attendees)
  @JoinColumn({ name: 'attendanceId', referencedColumnName: 'id' })
  @ApiProperty({ type: () => Attendance })
  attendance: Attendance;

  @OneToMany(() => Schedule, (schedule) => schedule.attendee)
  @ApiProperty({ type: () => Schedule })
  schedules: Schedule[];

  @OneToMany(() => Record, (record) => record.attendee)
  @ApiProperty({ type: () => Record })
  records: Record[];
}
