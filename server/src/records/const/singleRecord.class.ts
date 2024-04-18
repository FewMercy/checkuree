import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { AttendanceStatus } from './record-type.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DayType } from '../../schedules/const/day-type.enum';
import { LateTimeType } from './late-time-type.enum';
import { AbsenceType } from './absence-type.enum';

export class SingleRecord {
  @IsEnum(AttendanceStatus)
  @ApiProperty({
    description: '출석 기록 상태',
    type: 'enum',
    enum: AttendanceStatus,
    example: AttendanceStatus.PRESENT,
  })
  status: AttendanceStatus;

  @IsString()
  @ApiProperty({
    description: '출석 대상 PK',
    type: 'string',
    example: 'uuid-123123',
  })
  attendeeId: string;

  @IsDateString()
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

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: '비고',
    type: 'text',
    example: '출석체크의 특이사항 입니다.',
  })
  etc: string;

  @IsEnum(LateTimeType)
  @ApiPropertyOptional({ description: '지각 시간', type: 'enum', enum: LateTimeType })
  lateTime: LateTimeType;

  @IsEnum(AbsenceType)
  @ApiPropertyOptional({ description: '결석 종류', type: 'enum', enum: AbsenceType })
  absenceType: AbsenceType;
}
