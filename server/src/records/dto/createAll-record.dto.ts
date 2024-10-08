import { Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { DayType } from '../../schedules/const/day-type.enum';
import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { Record } from '../entities/record.entity';
import { Transform } from 'class-transformer';
import { AttendanceStatus } from '../const/record-type.enum';

export class CreateAllRecordDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: '출석부 PK',
    type: 'string',
    example: 'uuid-1234-uuid',
  })
  attendanceId: string;

  @IsEnum(AttendanceStatus)
  @ApiProperty({
    description: '출석 기록 상태',
    type: 'enum',
    enum: AttendanceStatus,
    example: AttendanceStatus.PRESENT,
  })
  status: AttendanceStatus;

  @IsDate()
  @ApiProperty({
    description: '출석날짜',
    type: 'date',
    example: '2024-12-03',
  })
  date: string;

  @IsEnum(DayType)
  @ApiProperty({
    description: '출석요일',
    type: 'enum',
    enum: DayType,
    example: DayType.MONDAY,
  })
  day: DayType;
}
