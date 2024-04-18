import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { Repository, UpdateResult } from 'typeorm';
import { Attendance } from './entities/attendance.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { UserAttendance } from './entities/user-attendance.entity';
import { RoleType } from '../roles/entities/role-type.enum';
import { ResponseWithoutPaginationDto } from '../common/response/responseWithoutPagination.dto';
import { CommonResponseDto } from '../common/response/common-response.dto';
import { AttendanceDay } from './entities/attendance-day.entity';
import { FileManagerService } from '../file-manager/file-manager.service';
import { isArray } from 'class-validator';
import { DayType } from '../schedules/const/day-type.enum';

@Injectable()
export class AttendancesService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
    @InjectRepository(UserAttendance)
    private userAttendanceRepository: Repository<UserAttendance>,
    @InjectRepository(AttendanceDay)
    private attendanceDayRepository: Repository<AttendanceDay>,
    private fileManagerService: FileManagerService,
  ) {}
  async create(createAttendanceDto: CreateAttendanceDto, user: User, image?: Express.Multer.File): Promise<CommonResponseDto<any>> {
    const attendanceDays = this.convertToAttendanceDays(createAttendanceDto.attendanceDays);

    if (!this.isValidDays(attendanceDays)) {
      throw new BadRequestException('출석부 요일이 올바르지 않습니다.');
    }

    const attendance = createAttendanceDto.toEntity();
    attendance.createId = user.id;

    if (image) {
      const imageUrl = await this.fileManagerService.saveImgFile(image);
      attendance.imageUrl = imageUrl;
    }

    const createdAttendance = await this.attendanceRepository.save(attendance);

    const userAttendance = new UserAttendance();
    userAttendance.attendanceId = createdAttendance.id;
    userAttendance.userId = user.id;
    userAttendance.role = RoleType.MASTER;
    userAttendance.createId = user.id;

    await this.userAttendanceRepository.save(userAttendance);

    await this.attendanceDayRepository.save(
      attendanceDays.map((day) => {
        return {
          attendanceId: createdAttendance.id,
          day: day,
        };
      }),
    );

    return new CommonResponseDto('SUCCESS CREATE ATTENDANCE', { id: createdAttendance.id });
  }

  async findAllByUserId(userId: string): Promise<ResponseWithoutPaginationDto<UserAttendance>> {
    const [items, count] = await this.userAttendanceRepository
      .createQueryBuilder('userAttendance')
      .leftJoinAndSelect('userAttendance.attendance', 'attendance')
      .leftJoinAndSelect('attendance.attendanceDays', 'attendanceDays')
      .loadRelationCountAndMap('attendance.attendeeCount', 'attendance.attendees')
      .where('userAttendance.userId = :userId', { userId })
      .getManyAndCount();

    items.forEach((item) => {
      item.attendance.days = item.attendance.attendanceDays.map((day) => day.day);
    });
    return new ResponseWithoutPaginationDto(count, items);
  }

  async findOneById(id: string): Promise<CommonResponseDto<Attendance>> {
    const attendance = await this.attendanceRepository.findOne({
      relations: {
        attendanceDays: true,
      },
      where: {
        id,
      },
    });

    attendance.days = attendance.attendanceDays.map((day) => day.day);

    return new CommonResponseDto('SUCCESS FIND ATTENDANCE', attendance);
  }

  async update(id: string, updateAttendanceDto: UpdateAttendanceDto): Promise<CommonResponseDto<any>> {
    await this.attendanceRepository.update(id, updateAttendanceDto);
    return new CommonResponseDto('SUCCESS UPDATE ATTENDANCE');
  }

  async delete(attendanceId: string, userId: string): Promise<CommonResponseDto<any>> {
    await this.attendanceRepository.softDelete(attendanceId);
    await this.userAttendanceRepository.softDelete({ attendanceId, userId });
    return new CommonResponseDto('SUCCESS DELETE ATTENDANCE');
  }

  private convertToAttendanceDays(daysString: string | undefined) {
    if (!daysString) {
      return [];
    }

    const arrayAttendanceDays = daysString.split(',').map((day) => {
      return day.trim() as DayType;
    });
    return arrayAttendanceDays;
  }

  private isValidDays(days: string[]) {
    return days.every((day) => Object.values(DayType).includes(day as DayType));
  }
}
