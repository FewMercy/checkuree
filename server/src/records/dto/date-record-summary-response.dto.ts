import { ApiProperty } from '@nestjs/swagger';

export class DateRecordSummaryResponseDto {
  @ApiProperty({ description: '출석 날짜', type: 'string' })
  date: string;

  @ApiProperty({ description: '출석 인원', type: 'number' })
  presentCount: number;

  @ApiProperty({ description: '결석 인원', type: 'number' })
  absenceCount: number;

  @ApiProperty({ description: '지각 인원', type: 'number' })
  lateCount: number;
}
