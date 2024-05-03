import { Body, Controller, Delete, Get, Param, Post, Query, Response, UseGuards } from '@nestjs/common';
import { RecordsService } from './records.service';
import { CreateRecordDto } from './dto/create-record.dto';
import { User } from '../users/entities/user.entity';
import { GetUser } from '../common/decorator/user.decorator';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Record } from './entities/record.entity';
import { RoleGuard } from '../roles/role.guard';
import { Roles } from '../roles/role.decorator';
import { RoleType } from '../roles/entities/role-type.enum';
import { AuthGuard } from '@nestjs/passport';
import { DeleteRecordDto } from './dto/delete-record.dto';
import { CreateAllRecordDto } from './dto/createAll-record.dto';
import { RecordFilterDto } from './dto/record-filter.dto';
import { PageResponseDto } from '../common/response/pageResponse.dto';
import { ResponseWithoutPaginationDto } from '../common/response/responseWithoutPagination.dto';
import { CommonResponseDto } from '../common/response/common-response.dto';
import { DateRecordSummaryResponseDto } from './dto/date-record-summary-response.dto';
import { AttendeeRecordSummaryDto } from './dto/attendee-record-summary.dto';

@UseGuards(AuthGuard('jwt'))
@Controller()
@ApiTags('출석기록')
@ApiBearerAuth('token')
export class RecordsController {
  constructor(private readonly recordsService: RecordsService) {}

  @Post('/records')
  @ApiOperation({
    description: '출석기록 생성 및 수정',
    summary: '출석기록 생성 및 수정',
  })
  @ApiBody({
    type: CreateRecordDto,
    description: '출석기록 생성 DTO',
  })
  @ApiResponse({
    status: 200,
    description: '출석기록 생성',
    type: CommonResponseDto<any>,
  })
  @UseGuards(RoleGuard)
  @Roles(RoleType.MASTER, RoleType.MANAGER, RoleType.GENERAL)
  async createRecord(@Body() createRecordDto: CreateRecordDto, @GetUser() user: User): Promise<CommonResponseDto<any>> {
    return this.recordsService.create(createRecordDto, user);
  }

  @Post('records/date')
  @ApiOperation({
    description: '선택한 날짜의 출석기록 일괄 생성',
    summary: '선택한 날짜의 출석기록 일괄 생성',
  })
  @ApiBody({
    type: CreateAllRecordDto,
    description: '출석기록 일괄 생성 DTO',
  })
  @ApiResponse({
    status: 200,
    description: '출석 기록 일괄 생성 후 affected Raws',
    type: CommonResponseDto<any>,
  })
  @UseGuards(RoleGuard)
  @Roles(RoleType.MASTER, RoleType.MANAGER, RoleType.GENERAL)
  async createAllRecord(@Body() createAllRecordDto: CreateAllRecordDto, @GetUser() user: User): Promise<CommonResponseDto<any>> {
    return this.recordsService.createAll(createAllRecordDto, user);
  }

  @Get('records/:id')
  @ApiOperation({
    description: '출석기록 ID로 조회',
    summary: '출석기록 ID로 조회',
  })
  @ApiResponse({
    status: 200,
    description: '출석기록 ID로 조회',
    type: CommonResponseDto<Record>,
  })
  findOne(@Param('id') id: string): Promise<CommonResponseDto<Record>> {
    return this.recordsService.findOneById(+id);
  }

  @Get('attendee/:attendeeId/records')
  @ApiOperation({
    description: '출석대상에 속한 출석기록 조회',
    summary: '출석대상에 속한 출석기록 조회',
  })
  @ApiResponse({
    status: 200,
    description: '출석대상에 속한 출석기록 조회',
    type: ResponseWithoutPaginationDto<Record>,
  })
  async findByAttendeeId(
    @Param('attendeeId') attendeeId: string,
    @Query() recordFilterDto: RecordFilterDto,
  ): Promise<ResponseWithoutPaginationDto<Record>> {
    return this.recordsService.findByAttendeeId(attendeeId, recordFilterDto);
  }

  @Get('attendance/:attendanceId/records/summary')
  @ApiOperation({
    description: '출석부에 속한 출석대상의 출석기록 요약',
    summary: '출석부에 속한 출석기록 조회',
  })
  @ApiResponse({
    status: 200,
    description: '출석부에 속한 출석대상의 출석기록 요약',
    type: PageResponseDto<Record>,
  })
  async getRecordSummaryByAttendeeId(
    @Param('attendanceId') attendanceId: string,
    @Query() attendeeRecordSummaryDto: AttendeeRecordSummaryDto,
  ) {
    return this.recordsService.getRecordSummaryByAttendeeId(attendanceId, attendeeRecordSummaryDto);
  }

  @Get('attendance/:attendanceId/records/:date/summary')
  @ApiOperation({
    description: '출석부에 속한 출석기록 요약 조회',
    summary: '출석부에 속한 출석기록 요약 조회',
  })
  @ApiResponse({
    status: 200,
    description: '출석부에 속한 출석기록 요약 조회',
    type: DateRecordSummaryResponseDto,
  })
  @UseGuards(RoleGuard)
  @Roles(RoleType.MASTER, RoleType.MANAGER, RoleType.GENERAL)
  async getRecordSummaryByAttendanceId(@Param('attendanceId') attendanceId: string, @Param('date') date: string): Promise<any> {
    return this.recordsService.getRecordSummaryByAttendanceId(attendanceId, date);
  }

  @Get('attendance/:attendanceId/records')
  @ApiOperation({
    description: '출석부에 속한 출석기록 조회',
    summary: '출석부에 속한 출석기록 조회',
  })
  @ApiResponse({
    status: 200,
    description: '출석부에 속한 출석기록 조회',
    type: PageResponseDto<Record>,
  })
  async findByAttendanceId(
    @Param('attendanceId') attendanceId: string,
    @Query() recordFilterDto: RecordFilterDto,
  ): Promise<PageResponseDto<Record>> {
    return this.recordsService.findByAttendanceId(attendanceId, recordFilterDto);
  }

  @Get('attendance/:attendanceId/records/excel')
  @ApiOperation({
    description: '출석부에 속한 출석기록 엑셀 다운로드',
    summary: '출석부에 속한 출석기록 엑셀 다운로드',
  })
  @ApiResponse({
    status: 200,
    description: '출석부에 속한 출석기록 엑셀 다운로드',
  })
  async downloadAttendanceRecordExcel(
    @Response() res,
    @Param('attendanceId') attendanceId: string,
    @Query() recordFilterDto: RecordFilterDto,
  ) {
    const buffer = await this.recordsService.excelDownload(attendanceId, recordFilterDto);
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="Members.xlsx"',
    });
    res.end(buffer);
  }

  @Get('attendee/:attendeeId/records/excel')
  @ApiOperation({
    description: '출석대상에 속한 출석기록 엑셀 다운로드',
    summary: '출석대상에 속한 출석기록 엑셀 다운로드',
  })
  @ApiResponse({
    status: 200,
    description: '출석대상에 속한 출석기록 엑셀 다운로드',
  })
  async downloadAttendeeRecordExcel(
    @Response() res,
    @Param('attendeeId') attendeeId: string,
    @Query() recordFilterDto: RecordFilterDto,
  ) {
    const buffer = await this.recordsService.attendeeRecordExcelDownload(attendeeId, recordFilterDto);
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="Members.xlsx"',
    });
    res.end(buffer);
  }

  @Delete('/records')
  @ApiOperation({ summary: '출석기록 일괄 삭제' })
  @ApiBody({
    type: DeleteRecordDto,
    description: '출석기록 삭제 DTO',
  })
  @ApiResponse({
    status: 204,
    description: '출석기록 일괄 삭제',
    type: CommonResponseDto<any>,
  })
  @UseGuards(RoleGuard)
  @Roles(RoleType.MASTER, RoleType.MANAGER)
  deleteAll(@Body() deleteRecordDto: DeleteRecordDto): Promise<CommonResponseDto<any>> {
    return this.recordsService.deleteAll(deleteRecordDto);
  }
}
