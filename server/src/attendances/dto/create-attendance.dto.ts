import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsString, Matches } from 'class-validator';
import {} from '../../auth/const/error-message';
import { ApiProperty } from '@nestjs/swagger';
import { Optional } from '@nestjs/common';
import { AttendanceType } from '../const/attendance-type.enum';
import { Attendance } from '../entities/attendance.entity';
import { Column } from 'typeorm';
import { DayType } from '../../schedules/const/day-type.enum';

export class CreateAttendanceDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: '출석부 제목',
    type: 'string',
    example: 'attendance title',
  })
  title: string;

  @IsString()
  @Optional()
  @ApiProperty({
    description: '출석부 설명',
    type: 'string',
    example: 'attendance description',
  })
  description: string;

  @ApiProperty({ description: '출석부 사용 시작 시간', type: 'string', example: '1200' })
  @IsString()
  @Matches(/^[0-9]{4}$/, { message: '출석부 사용 시작 시간은 4자리 숫자여야 합니다.' })
  availableFrom: string;

  @ApiProperty({ description: '출석부 사용 종료 시간', type: 'string', example: '2000' })
  @IsString()
  @Matches(/^[0-9]{4}$/, { message: '출석부 사용 시작 시간은 4자리 숫자여야 합니다.' })
  availableTo: string;

  @ApiProperty({ description: '지각 상태 사용 유무', type: 'boolean' })
  @IsBoolean()
  allowLateness: boolean;

  @ApiProperty({ description: '출석부 사용 요일', isArray: true, type: 'enum', enum: DayType })
  @IsArray()
  @IsEnum(DayType, { each: true })
  attendanceDays: DayType[];

  toEntity() {
    const attendance = new Attendance();
    attendance.title = this.title;
    attendance.description = this?.description;
    attendance.availableFrom = this.availableFrom;
    attendance.availableTo = this.availableTo;
    attendance.allowLateness = this.allowLateness;
    return attendance;
  }
}
