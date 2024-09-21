import { ApiPropertyOptional } from '@nestjs/swagger';
import { DayType } from '../const/day-type.enum';
import { IsEnum, IsOptional } from 'class-validator';
import { IsTimeFormat } from '../../common/decorator/isTimeformat.decorator';
import { Pagination } from '../../common/response/pagination';

export class ScheduleFilterDto extends Pagination {
  @IsEnum(DayType, { each: true })
  @IsOptional()
  @ApiPropertyOptional({
    description: '(미구현)출석부 요일 배열',
    type: 'Array',
    nullable: true,
  })
  days?: DayType[];

  @IsTimeFormat()
  @IsOptional()
  @ApiPropertyOptional({
    description: '(미구현)검색 시작기준 시간 (format:hhmm)',
    type: 'string',
    nullable: true,
  })
  timeFrom?: string;

  @IsTimeFormat()
  @IsOptional()
  @ApiPropertyOptional({
    description: '(미구현)검색 종료기준 시간 (format:hhmm)',
    type: 'string',
    nullable: true,
  })
  timeTo?: string;

  // of 패턴으로 팩토리 메서드 구현
  static of(pageNo: number = 1, pageSize: number = 10): ScheduleFilterDto {
    const dto = new ScheduleFilterDto();
    dto.pageNo = pageNo;
    dto.pageSize = pageSize;
    return dto;
  }
}
