import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { GetUser } from '../common/decorator/user.decorator';
import { User } from '../users/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Schedule } from './entities/schedule.entity';
import { ScheduleFilterDto } from './dto/schedule-filter.dto';
import { DeleteScheduleDto } from './dto/delete-schedule.dto';
import { CommonResponseDto } from '../common/response/common-response.dto';
import { ResponseWithoutPaginationDto } from '../common/response/responseWithoutPagination.dto';
import { PageResponseDto } from '../common/response/pageResponse.dto';
import { TimeGroupedScheduleResDto } from './const/time-grouped-schedule-res.dto';

@Controller()
@UseGuards(AuthGuard('jwt'))
@ApiTags('출석 스케쥴')
@ApiBearerAuth('token')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Post('/schedules')
  @ApiOperation({ summary: '출석 스케쥴 생성 / 수정 (이전 스케쥴 삭제)' })
  @ApiResponse({
    status: 200,
    description: '출석 스케쥴 생성',
    type: CommonResponseDto<{ id: number }>,
  })
  @ApiBody({
    type: CreateScheduleDto,
    description: '출석 스케쥴 생성 DTO',
  })
  create(@Body() createScheduleDto: CreateScheduleDto, @GetUser() user: User): Promise<CommonResponseDto<{ ids: number[] }>> {
    return this.schedulesService.create(createScheduleDto, user);
  }

  @Get('/attendee/:attendeeId/schedules')
  @ApiOperation({ summary: '출석대상의 스케쥴 조회' })
  @ApiResponse({
    status: 200,
    description: '출석대상의 스케쥴 조회',
    type: ResponseWithoutPaginationDto<Schedule>,
  })
  findByAttendeeId(@Param('attendeeId') attendeeId: string): Promise<ResponseWithoutPaginationDto<Schedule>> {
    return this.schedulesService.findByAttendeeId(attendeeId);
  }

  @Get('/attendanceId/:attendanceId/schedules')
  @ApiOperation({ summary: '출석부에 속한 모든 스케쥴 조회' })
  @ApiResponse({
    status: 200,
    description: '출석부에 속한 모든 스케쥴 조회',
    type: ResponseWithoutPaginationDto<Schedule>,
  })
  findByAttendanceId(
    @Param('attendanceId') attendanceId: string,
    @Query() scheduleFilterDto: ScheduleFilterDto,
  ): Promise<ResponseWithoutPaginationDto<Schedule>> {
    return this.schedulesService.findAllByAttendanceId(attendanceId, scheduleFilterDto);
  }

  @Get('/attendanceId/:attendanceId/schedules/:date')
  @ApiOperation({ summary: '해당 출석부의 오늘의 스케쥴과 출석내역 조회' })
  @ApiResponse({
    status: 200,
    description: '해당 출석부의 오늘의 스케쥴과 출석내역 조회',
    type: ResponseWithoutPaginationDto<Schedule>,
  })
  findScheduleByAttendanceIdAndDate(
    @Param('attendanceId') attendanceId: string,
    @Param('date')
    dateString: string,
    @Query()
    scheduleFilterDto: ScheduleFilterDto,
  ): Promise<PageResponseDto<TimeGroupedScheduleResDto>> {
    return this.schedulesService.findScheduleByAttendanceIdAndDate(attendanceId, dateString, scheduleFilterDto);
  }

  @Delete('/schedules')
  @ApiOperation({ summary: '스케쥴 일괄 삭제' })
  @ApiResponse({
    status: 200,
    description: '스케쥴 일괄 삭제',
    type: CommonResponseDto<any>,
  })
  deleteAll(@Body() deleteScheduleDto: DeleteScheduleDto): Promise<CommonResponseDto<any>> {
    return this.schedulesService.deleteAll(deleteScheduleDto);
  }
}
