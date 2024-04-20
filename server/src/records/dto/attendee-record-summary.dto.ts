import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class AttendeeRecordSummaryDto {
  @ApiProperty({
    description: '출석자 ID 배열',
    type: 'array',
    isArray: true,
    example: ['1', '2', '3'],
  })
  @IsArray()
  @IsString({ each: true })
  attendeeIds: string[];
}
