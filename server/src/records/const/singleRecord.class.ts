import { IsDateString, IsEnum, IsOptional, IsString, Matches } from 'class-validator';
import { AttendanceStatus } from './record-type.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DayType } from '../../schedules/const/day-type.enum';
import { LateTimeType } from './late-time-type.enum';
import { AbsenceType } from './absence-type.enum';

export class SingleRecord {
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

  @IsString()
  @Matches(/^\d{4}$/)
  @ApiProperty({
    description: '출석 시간',
    type: 'string',
    example: '0930',
  })
  time: string;

  @IsEnum(DayType, { message: '요일이 정확하지 않습니다.' })
  @ApiProperty({
    description: '출석요일',
    type: 'enum',
    enum: DayType,
    example: DayType.MONDAY,
  })
  day: DayType;

  @IsEnum(AttendanceStatus)
  @ApiProperty({
    description: '출석 기록 상태',
    type: 'enum',
    enum: AttendanceStatus,
    example: AttendanceStatus.PRESENT,
  })
  status: AttendanceStatus;

  @IsEnum(LateTimeType, { message: '지각타입이 정확하지 않습니다.' })
  @IsOptional()
  @ApiPropertyOptional({ description: '지각 시간', type: 'enum', enum: LateTimeType })
  lateTime: LateTimeType;

  @IsEnum(AbsenceType, { message: '결석타입이 정확하지 않습니다.' })
  @IsOptional()
  @ApiPropertyOptional({ description: '결석 종류', type: 'enum', enum: AbsenceType })
  absenceType: AbsenceType;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: '비고',
    type: 'text',
    example: '출석체크의 특이사항 입니다.',
  })
  etc: string;
}
