import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AttendancesService } from './attendances.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from '../users/entities/user.entity';
import { GetUser } from '../common/decorator/user.decorator';
import { Attendance } from './entities/attendance.entity';
import { UserAttendance } from './entities/user-attendance.entity';
import { RoleGuard } from '../roles/role.guard';
import { RoleType } from '../roles/entities/role-type.enum';
import { Roles } from '../roles/role.decorator';
import { CommonResponseDto } from '../common/response/common-response.dto';
import { ResponseWithoutPaginationDto } from '../common/response/responseWithoutPagination.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageValidatorPipe } from '../file-manager/const/image-validator.pipe';
import { PROFILE_IMAGE_MAX_SIZE_IN_MB } from '../file-manager/const/file.const';

@UseGuards(AuthGuard('jwt'))
@Controller('attendances')
@ApiTags('출석부')
@ApiBearerAuth('token')
export class AttendancesController {
  constructor(private readonly attendancesService: AttendancesService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: '출석부 생성' })
  @ApiResponse({
    status: 200,
    description: '출석부 생성',
    type: CommonResponseDto<any>,
  })
  @ApiBody({
    type: CreateAttendanceDto,
    description: '출석부 생성 DTO',
  })
  @UseInterceptors(FileInterceptor('image'))
  createAttendance(
    @Body() createAttendanceDto: CreateAttendanceDto,
    @GetUser() user: User,
    @UploadedFile(ImageValidatorPipe(PROFILE_IMAGE_MAX_SIZE_IN_MB))
    image?: Express.Multer.File,
  ): Promise<CommonResponseDto<any>> {
    return this.attendancesService.create(createAttendanceDto, user, image);
  }

  @Get()
  @ApiOperation({ summary: '로그인한 회원의 출석부 목록 조회' })
  @ApiOkResponse({
    status: 200,
    description: '로그인한 회원의 출석부 목록 조회',
    type: ResponseWithoutPaginationDto<UserAttendance>,
  })
  findAllByUserId(@GetUser() user: User): Promise<ResponseWithoutPaginationDto<UserAttendance>> {
    return this.attendancesService.findAllByUserId(user.id);
  }

  @Get(':attendanceId')
  @UseGuards(RoleGuard)
  @Roles(RoleType.MASTER, RoleType.MANAGER, RoleType.GENERAL, RoleType.READER)
  @ApiOperation({ summary: '출석부 상세 조회' })
  @ApiOkResponse({
    status: 200,
    description: '출석부 정보 수정',
    type: CommonResponseDto<Attendance>,
  })
  findOneById(@Param('attendanceId') attendanceId: string): Promise<CommonResponseDto<Attendance>> {
    return this.attendancesService.findOneById(attendanceId);
  }

  @Patch(':attendanceId')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: '출석부 정보 수정' })
  @ApiOkResponse({
    status: 200,
    description: '출석부 정보 수정',
    type: CommonResponseDto<any>,
  })
  @UseGuards(RoleGuard)
  @Roles(RoleType.MASTER, RoleType.MANAGER)
  @UseInterceptors(FileInterceptor('image'))
  update(
    // RoleGuard 적용을 위해 attendanceId로 parameter 이름 지정
    @Param('attendanceId') attendanceId: string,
    @Body() updateAttendanceDto: UpdateAttendanceDto,
    @UploadedFile(ImageValidatorPipe(PROFILE_IMAGE_MAX_SIZE_IN_MB))
    image?: Express.Multer.File,
  ): Promise<CommonResponseDto<any>> {
    return this.attendancesService.update(attendanceId, updateAttendanceDto, image);
  }

  @Delete(':attendanceId')
  @UseGuards(RoleGuard)
  @Roles(RoleType.MASTER)
  @ApiOperation({ summary: '출석부 삭제' })
  @ApiResponse({
    status: 204,
    description: '삭제 후 No Content 값 전달',
    type: CommonResponseDto<any>,
  })
  delete(@Param('attendanceId') attendanceId: string, @GetUser() user: User): Promise<CommonResponseDto<any>> {
    return this.attendancesService.delete(attendanceId, user.id);
  }
}
