import { ApiPropertyOptional } from '@nestjs/swagger';
import { DayType } from '../const/day-type.enum';
import { IsEnum, IsOptional } from 'class-validator';
import { IsTimeFormat } from '../../common/decorator/isTimeformat.decorator';
import { Pagination } from '../../common/response/pagination';

export class ScheduleFilterDto extends Pagination {
  @IsEnum(DayType, { each: true })
  @IsOptional()
  @ApiPropertyOptional({
    description: '출석부 요일 배열',
    type: 'Array',
    nullable: true,
    example: [DayType.MONDAY, DayType.TUESDAY],
  })
  days?: DayType[];

  @IsTimeFormat()
  @IsOptional()
  @ApiPropertyOptional({
    description: '검색 시작기준 시간 (format:hhmm)',
    type: 'string',
    nullable: true,
    example: '1200',
  })
  timeFrom?: string;

  @IsTimeFormat()
  @IsOptional()
  @ApiPropertyOptional({
    description: '검색 종료기준 시간 (format:hhmm)',
    type: 'string',
    nullable: true,
    example: '1815',
  })
  timeTo?: string;
}
