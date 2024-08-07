import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AttendeesService } from './attendees.service';
import { CreateAttendeeDto } from './dto/create-attendee.dto';
import { UpdateAttendeeDto } from './dto/update-attendee.dto';
import { GetUser } from '../common/decorator/user.decorator';
import { User } from '../users/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Attendee } from './entities/attendee.entity';
import { RoleGuard } from '../roles/role.guard';
import { Roles } from '../roles/role.decorator';
import { RoleType } from '../roles/const/role-type.enum';
import { DeleteAttendeeDto } from './dto/delete-attendee.dto';
import { CommonResponseDto } from '../common/response/common-response.dto';
import { ResponseWithoutPaginationDto } from '../common/response/responseWithoutPagination.dto';

@Controller('attendees')
@UseGuards(AuthGuard('jwt'))
@ApiTags('출석 대상')
@ApiBearerAuth('token')
export class AttendeesController {
  constructor(private readonly attendeesService: AttendeesService) {}

  @Post()
  @ApiOperation({ summary: '출석 대상 생성' })
  @ApiResponse({
    status: 200,
    description: '출석 대상 생성',
    type: CommonResponseDto<any>,
  })
  @ApiBody({
    type: CreateAttendeeDto,
    description: '출석 대상 생성 DTO',
  })
  @UseGuards(RoleGuard)
  @Roles(RoleType.MASTER, RoleType.MANAGER, RoleType.GENERAL)
  async create(@Body() createAttendeeDto: CreateAttendeeDto, @GetUser() user: User): Promise<CommonResponseDto<any>> {
    return this.attendeesService.createAttendee(createAttendeeDto, user);
  }

  @Get('attendanceId/:attendanceId')
  @ApiOperation({ summary: '로그인한 회원의 출석부 출석 대상 조회' })
  @ApiResponse({
    status: 200,
    description: '해당 출석부의 출석 대상 조회',
    type: ResponseWithoutPaginationDto<Attendee>,
  })
  @UseGuards(RoleGuard)
  @Roles(RoleType.MASTER, RoleType.GENERAL, RoleType.MANAGER, RoleType.READER)
  async findAllByAttendanceId(@Param('attendanceId') attendanceId: string): Promise<ResponseWithoutPaginationDto<Attendee>> {
    return this.attendeesService.findAllByAttendanceId(attendanceId);
  }

  @Get(':id')
  @ApiOperation({ summary: '출석 대상 상세 조회' })
  @ApiResponse({
    status: 200,
    description: '출석 대상 상세 조회',
    type: CommonResponseDto<Attendee>,
  })
  async findOne(@Param('id') id: string): Promise<CommonResponseDto<Attendee>> {
    return this.attendeesService.findOneById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '출석대상 수정' })
  @ApiResponse({
    status: 200,
    description: '출석대상 수정',
    type: CommonResponseDto<any>,
  })
  @UseGuards(RoleGuard)
  @Roles(RoleType.MASTER, RoleType.MANAGER, RoleType.GENERAL)
  async update(@Param('id') id: string, @Body() updateAttendeeDto: UpdateAttendeeDto): Promise<CommonResponseDto<any>> {
    return this.attendeesService.update(id, updateAttendeeDto);
  }

  @Delete()
  @ApiOperation({ summary: '출석대상 일괄 삭제' })
  @ApiBody({
    type: DeleteAttendeeDto,
    description: '출석대상 삭제 DTO',
  })
  @ApiResponse({
    status: 204,
    description: '출석대상 일괄 삭제',
    type: CommonResponseDto<any>,
  })
  @UseGuards(RoleGuard)
  @Roles(RoleType.MASTER, RoleType.MANAGER, RoleType.GENERAL)
  delete(@Body() deleteAttendeeDto: DeleteAttendeeDto): Promise<CommonResponseDto<any>> {
    return this.attendeesService.deleteAll(deleteAttendeeDto);
  }
}
